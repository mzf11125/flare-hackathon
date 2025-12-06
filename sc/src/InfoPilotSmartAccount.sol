// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./interfaces/IFtsoV2.sol";
import "./interfaces/IFtsoFeedIdConverter.sol";
import "./interfaces/ISentimentOracle.sol";
import "./interfaces/IDEXRouter.sol";
import "./interfaces/IERC20.sol";

/**
 * @title InfoPilotSmartAccount
 * @notice Autonomous trading agent that executes based on FTSO price feeds + sentiment data
 * @dev Demonstrates Information Finance (InfoFi) - trading based on multi-source intelligence
 * 
 * Key Features:
 * - Monitors real-time prices via Flare FTSO
 * - Evaluates market sentiment (simulated FDC in testnet)
 * - Auto-executes swaps when conditions are met
 * - User-defined rules for portfolio rebalancing
 */
contract InfoPilotSmartAccount {
    
    // ============ State Variables ============
    
    address public owner;
    IFtsoV2 public ftsoV2;
    IFtsoFeedIdConverter public feedConverter;
    ISentimentOracle public sentimentOracle;
    IDEXRouter public dexRouter;

    /**
     * @notice Trading rule structure
     * @dev Combines price threshold (FTSO) with sentiment condition (FDC simulation)
     */
    struct InfoRule {
        bytes21 priceFeedId;        // FTSO feed ID (e.g., BTC/USD)
        string assetSymbol;         // Asset symbol for sentiment (e.g., "BTC")
        uint256 priceThreshold;     // Price threshold in wei (18 decimals)
        bool isPriceBelow;          // true = trigger when price < threshold, false = price > threshold
        int8 sentimentCondition;    // -1 = NEGATIVE, 0 = NEUTRAL, 1 = POSITIVE
        uint256 swapPercentage;     // Percentage to swap (in basis points, 10000 = 100%)
        address tokenIn;            // Token to swap from
        address tokenOut;           // Token to swap to
        bool active;                // Is rule active?
        uint64 createdAt;          // When rule was created
    }

    InfoRule public currentRule;
    
    // Track execution history
    struct ExecutionLog {
        uint256 timestamp;
        uint256 priceAtExecution;
        int8 sentimentAtExecution;
        uint256 amountSwapped;
        address tokenIn;
        address tokenOut;
    }
    
    ExecutionLog[] public executionHistory;

    // ============ Events ============
    
    event RuleCreated(
        bytes21 indexed feedId,
        string assetSymbol,
        uint256 priceThreshold,
        int8 sentimentCondition
    );
    
    event RuleEvaluated(
        bool priceConditionMet,
        bool sentimentConditionMet,
        uint256 currentPrice,
        int8 currentSentiment
    );
    
    event AutoSwapExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 timestamp
    );

    event RuleDeactivated(uint256 timestamp);

    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    // ============ Constructor ============
    
    /**
     * @notice Initialize InfoPilot Smart Account
     * @param _ftsoV2 Address of FTSO V2 contract (Coston2: 0x7BDE3Df0624114eDB3A67dFe6753e62f4e7c1d20)
     * @param _feedConverter Address of Feed ID Converter (Coston2: 0xafEa60cabb2daB413D17b85Db82cCf6EB06a0F66)
     * @param _sentimentOracle Address of sentiment oracle (mock for testnet)
     * @param _dexRouter Address of DEX router (mock for testnet)
     */
    constructor(
        address _ftsoV2,
        address _feedConverter,
        address _sentimentOracle,
        address _dexRouter
    ) {
        require(_ftsoV2 != address(0), "Invalid FTSO address");
        require(_feedConverter != address(0), "Invalid converter address");
        require(_sentimentOracle != address(0), "Invalid oracle address");
        require(_dexRouter != address(0), "Invalid DEX address");

        owner = msg.sender;
        ftsoV2 = IFtsoV2(_ftsoV2);
        feedConverter = IFtsoFeedIdConverter(_feedConverter);
        sentimentOracle = ISentimentOracle(_sentimentOracle);
        dexRouter = IDEXRouter(_dexRouter);
    }

    // ============ Core Functions ============

    /**
     * @notice Create a new trading rule
     * @param _feedName Price feed name (e.g., "BTC/USD")
     * @param _assetSymbol Asset symbol for sentiment (e.g., "BTC")
     * @param _priceThreshold Price threshold in wei (18 decimals)
     * @param _isPriceBelow True if trigger when price is below threshold
     * @param _sentimentCondition Sentiment to trigger on (-1, 0, or 1)
     * @param _swapPercentage Percentage of balance to swap (basis points, 10000 = 100%)
     * @param _tokenIn Token to swap from
     * @param _tokenOut Token to swap to
     */
    function setRule(
        string memory _feedName,
        string memory _assetSymbol,
        uint256 _priceThreshold,
        bool _isPriceBelow,
        int8 _sentimentCondition,
        uint256 _swapPercentage,
        address _tokenIn,
        address _tokenOut
    ) external onlyOwner {
        require(_priceThreshold > 0, "Invalid price threshold");
        require(_sentimentCondition >= -1 && _sentimentCondition <= 1, "Invalid sentiment");
        require(_swapPercentage > 0 && _swapPercentage <= 10000, "Invalid percentage");
        require(_tokenIn != address(0) && _tokenOut != address(0), "Invalid token addresses");
        require(_tokenIn != _tokenOut, "Same token swap not allowed");

        // Get feed ID from converter (category 1 = crypto)
        bytes21 feedId = feedConverter.getFeedId(1, _feedName);

        currentRule = InfoRule({
            priceFeedId: feedId,
            assetSymbol: _assetSymbol,
            priceThreshold: _priceThreshold,
            isPriceBelow: _isPriceBelow,
            sentimentCondition: _sentimentCondition,
            swapPercentage: _swapPercentage,
            tokenIn: _tokenIn,
            tokenOut: _tokenOut,
            active: true,
            createdAt: uint64(block.timestamp)
        });

        emit RuleCreated(feedId, _assetSymbol, _priceThreshold, _sentimentCondition);
    }

    /**
     * @notice Evaluate current conditions and execute swap if conditions are met
     * @dev This is the core "autonomous agent" logic
     * @return executed Whether the swap was executed
     */
    function evaluate() external returns (bool executed) {
        require(currentRule.active, "No active rule");

        // Get current price from FTSO
        (uint256 currentPrice, ) = ftsoV2.getFeedByIdInWei(currentRule.priceFeedId);

        // Get current sentiment from oracle
        (int8 currentSentiment, ) = sentimentOracle.getSentiment(currentRule.assetSymbol);

        // Check price condition
        bool priceConditionMet = currentRule.isPriceBelow
            ? currentPrice <= currentRule.priceThreshold
            : currentPrice >= currentRule.priceThreshold;

        // Check sentiment condition
        bool sentimentConditionMet = currentSentiment == currentRule.sentimentCondition;

        emit RuleEvaluated(priceConditionMet, sentimentConditionMet, currentPrice, currentSentiment);

        // Execute if BOTH conditions are met
        if (priceConditionMet && sentimentConditionMet) {
            _executeAutoSwap(currentPrice, currentSentiment);
            currentRule.active = false;
            emit RuleDeactivated(block.timestamp);
            return true;
        }

        return false;
    }

    /**
     * @notice Execute the automatic swap
     * @dev Internal function called when conditions are met
     */
    function _executeAutoSwap(uint256 priceAtExecution, int8 sentimentAtExecution) internal {
        // Calculate swap amount based on percentage
        uint256 balance = IERC20(currentRule.tokenIn).balanceOf(address(this));
        uint256 swapAmount = (balance * currentRule.swapPercentage) / 10000;
        
        require(swapAmount > 0, "Insufficient balance to swap");

        // Approve DEX to spend tokens
        IERC20(currentRule.tokenIn).approve(address(dexRouter), swapAmount);

        // Prepare swap path
        address[] memory path = new address[](2);
        path[0] = currentRule.tokenIn;
        path[1] = currentRule.tokenOut;

        // Execute swap (accepting any amount for demo - should set slippage in production)
        uint256[] memory amounts = dexRouter.swapExactTokensForTokens(
            swapAmount,
            0, // amountOutMin - should calculate with slippage tolerance in production
            path,
            address(this),
            block.timestamp + 300 // 5 minute deadline
        );

        // Log execution
        executionHistory.push(ExecutionLog({
            timestamp: block.timestamp,
            priceAtExecution: priceAtExecution,
            sentimentAtExecution: sentimentAtExecution,
            amountSwapped: amounts[0],
            tokenIn: currentRule.tokenIn,
            tokenOut: currentRule.tokenOut
        }));

        emit AutoSwapExecuted(
            currentRule.tokenIn,
            currentRule.tokenOut,
            amounts[0],
            amounts[1],
            block.timestamp
        );
    }

    // ============ View Functions ============

    /**
     * @notice Get current price from FTSO for the active rule
     * @return price Current price in wei
     * @return timestamp When price was last updated
     */
    function getCurrentPrice() external returns (uint256 price, uint64 timestamp) {
        require(currentRule.active, "No active rule");
        return ftsoV2.getFeedByIdInWei(currentRule.priceFeedId);
    }

    /**
     * @notice Get current sentiment for the active rule
     * @return sentiment Current sentiment value
     * @return timestamp When sentiment was last updated
     */
    function getCurrentSentiment() external view returns (int8 sentiment, uint64 timestamp) {
        require(currentRule.active, "No active rule");
        return sentimentOracle.getSentiment(currentRule.assetSymbol);
    }

    /**
     * @notice Check if current conditions would trigger the rule
     * @return wouldExecute Whether execution would occur now
     * @return priceConditionMet Current price condition status
     * @return sentimentConditionMet Current sentiment condition status
     */
    function checkConditions()
        external
        returns (bool wouldExecute, bool priceConditionMet, bool sentimentConditionMet)
    {
        if (!currentRule.active) {
            return (false, false, false);
        }

        (uint256 currentPrice, ) = ftsoV2.getFeedByIdInWei(currentRule.priceFeedId);
        (int8 currentSentiment, ) = sentimentOracle.getSentiment(currentRule.assetSymbol);

        priceConditionMet = currentRule.isPriceBelow
            ? currentPrice <= currentRule.priceThreshold
            : currentPrice >= currentRule.priceThreshold;

        sentimentConditionMet = currentSentiment == currentRule.sentimentCondition;
        wouldExecute = priceConditionMet && sentimentConditionMet;

        return (wouldExecute, priceConditionMet, sentimentConditionMet);
    }

    /**
     * @notice Get execution history count
     */
    function getExecutionCount() external view returns (uint256) {
        return executionHistory.length;
    }

    /**
     * @notice Get specific execution from history
     */
    function getExecution(uint256 index) external view returns (ExecutionLog memory) {
        require(index < executionHistory.length, "Invalid index");
        return executionHistory[index];
    }

    /**
     * @notice Get token balance
     */
    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    // ============ Admin Functions ============

    /**
     * @notice Manually deactivate current rule
     */
    function deactivateRule() external onlyOwner {
        require(currentRule.active, "Rule already inactive");
        currentRule.active = false;
        emit RuleDeactivated(block.timestamp);
    }

    /**
     * @notice Emergency withdraw tokens
     */
    function withdrawToken(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner, amount), "Transfer failed");
    }

    /**
     * @notice Withdraw native token (FLR)
     */
    function withdrawNative(uint256 amount) external onlyOwner {
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");
    }

    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }

    // ============ Receive Functions ============

    receive() external payable {}
    fallback() external payable {}
}
