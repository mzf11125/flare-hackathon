// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "../interfaces/IDEXRouter.sol";
import "../interfaces/IERC20.sol";

/**
 * @title MockDEX
 * @notice Mock DEX implementation for testing (simulates Uniswap-style swaps)
 * @dev Uses a simple 1:1 exchange rate for demo purposes
 *      In production, this would be replaced with actual DEX integration
 */
contract MockDEX is IDEXRouter {
    // Simple liquidity pools: tokenA => tokenB => exchange rate (in basis points, 10000 = 1:1)
    mapping(address => mapping(address => uint256)) public exchangeRates;
    
    address public owner;

    event Swap(
        address indexed sender,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Set exchange rate between two tokens
     * @param tokenA First token address
     * @param tokenB Second token address
     * @param rate Exchange rate in basis points (10000 = 1:1, 20000 = 2:1)
     */
    function setExchangeRate(address tokenA, address tokenB, uint256 rate) external onlyOwner {
        require(tokenA != address(0) && tokenB != address(0), "Invalid token address");
        require(rate > 0, "Rate must be > 0");
        exchangeRates[tokenA][tokenB] = rate;
    }

    /**
     * @notice Swaps exact amount of input tokens for output tokens
     * @param amountIn The amount of input tokens to send
     * @param amountOutMin The minimum amount of output tokens that must be received
     * @param path An array of token addresses (must be length 2 for this mock)
     * @param to Recipient of the output tokens
     * @param deadline Unix timestamp after which the transaction will revert
     * @return amounts The input and output amounts
     */
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external override returns (uint256[] memory amounts) {
        require(deadline >= block.timestamp, "Deadline expired");
        require(path.length == 2, "Invalid path length");
        require(amountIn > 0, "Amount must be > 0");

        address tokenIn = path[0];
        address tokenOut = path[1];

        // Get exchange rate
        uint256 rate = exchangeRates[tokenIn][tokenOut];
        require(rate > 0, "Exchange rate not set");

        // Calculate output amount
        uint256 amountOut = (amountIn * rate) / 10000;
        require(amountOut >= amountOutMin, "Insufficient output amount");

        // Transfer tokens
        require(
            IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn),
            "Transfer in failed"
        );
        require(IERC20(tokenOut).transfer(to, amountOut), "Transfer out failed");

        // Prepare return array
        amounts = new uint256[](2);
        amounts[0] = amountIn;
        amounts[1] = amountOut;

        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);

        return amounts;
    }

    /**
     * @notice Calculate expected output amounts for a swap
     * @param amountIn Amount of input tokens
     * @param path Array of token addresses
     * @return amounts Expected output amounts
     */
    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        override
        returns (uint256[] memory amounts)
    {
        require(path.length == 2, "Invalid path length");
        
        address tokenIn = path[0];
        address tokenOut = path[1];
        uint256 rate = exchangeRates[tokenIn][tokenOut];

        amounts = new uint256[](2);
        amounts[0] = amountIn;
        amounts[1] = rate > 0 ? (amountIn * rate) / 10000 : 0;

        return amounts;
    }

    /**
     * @notice Add liquidity to the mock DEX (for testing)
     * @param token The token to add
     * @param amount The amount to add
     */
    function addLiquidity(address token, uint256 amount) external {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }

    /**
     * @notice Get the balance of a token in the DEX
     */
    function getReserve(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}
