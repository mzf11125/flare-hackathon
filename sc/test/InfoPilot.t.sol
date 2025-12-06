// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../src/InfoPilotSmartAccount.sol";
import "../src/InfoPilotFactory.sol";
import "../src/mocks/MockSentimentOracle.sol";
import "../src/mocks/MockDEX.sol";
import "../src/mocks/MockERC20.sol";
import "../src/interfaces/IFtsoV2.sol";
import "../src/interfaces/IFtsoFeedIdConverter.sol";

contract InfoPilotTest is Test {
    
    InfoPilotFactory public factory;
    InfoPilotSmartAccount public account;
    MockSentimentOracle public sentimentOracle;
    MockDEX public dex;
    MockERC20 public tokenA;
    MockERC20 public tokenB;
    
    // Mock FTSO contracts
    address public mockFtsoV2;
    address public mockFeedConverter;
    
    address public user = address(0x1);
    address public user2 = address(0x2);
    
    // Test constants
    bytes21 constant BTC_FEED_ID = bytes21(uint168(1));
    uint256 constant INITIAL_BALANCE = 10000 * 10**18;
    uint256 constant DEX_LIQUIDITY = 1000000 * 10**18;

    event RuleCreated(
        bytes21 indexed feedId,
        string assetSymbol,
        uint256 priceThreshold,
        int8 sentimentCondition
    );

    event AutoSwapExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 timestamp
    );

    function setUp() public {
        // Deploy mock FTSO contracts
        mockFtsoV2 = address(new MockFtsoV2());
        mockFeedConverter = address(new MockFeedConverter());
        
        // Deploy infrastructure
        sentimentOracle = new MockSentimentOracle();
        dex = new MockDEX();
        
        // Deploy test tokens
        tokenA = new MockERC20("Token A", "TKA", 18);
        tokenB = new MockERC20("Token B", "TKB", 18);
        
        // Setup DEX
        dex.setExchangeRate(address(tokenA), address(tokenB), 10000); // 1:1
        dex.setExchangeRate(address(tokenB), address(tokenA), 10000);
        
        // Add liquidity to DEX
        tokenA.mint(address(this), DEX_LIQUIDITY);
        tokenB.mint(address(this), DEX_LIQUIDITY);
        tokenA.approve(address(dex), DEX_LIQUIDITY);
        tokenB.approve(address(dex), DEX_LIQUIDITY);
        dex.addLiquidity(address(tokenA), DEX_LIQUIDITY / 2);
        dex.addLiquidity(address(tokenB), DEX_LIQUIDITY / 2);
        
        // Deploy factory
        factory = new InfoPilotFactory(
            mockFtsoV2,
            mockFeedConverter,
            address(sentimentOracle),
            address(dex)
        );
        
        // Create account for user
        vm.prank(user);
        address accountAddr = factory.createAccount();
        account = InfoPilotSmartAccount(payable(accountAddr));
        
        // Fund account
        tokenA.mint(address(account), INITIAL_BALANCE);
    }

    // ============ Factory Tests ============

    function testFactoryDeployment() public view {
        (
            address ftso,
            address converter,
            address oracle,
            address router
        ) = factory.getConfiguration();
        
        assertEq(ftso, mockFtsoV2);
        assertEq(converter, mockFeedConverter);
        assertEq(oracle, address(sentimentOracle));
        assertEq(router, address(dex));
    }

    function testCreateAccount() public {
        vm.prank(user2);
        address newAccount = factory.createAccount();
        
        assertTrue(newAccount != address(0));
        assertEq(InfoPilotSmartAccount(payable(newAccount)).owner(), user2);
        assertEq(factory.getUserAccountCount(user2), 1);
    }

    function testCreateMultipleAccounts() public {
        vm.prank(user2);
        address[] memory accounts = factory.createMultipleAccounts(3);
        
        assertEq(accounts.length, 3);
        assertEq(factory.getUserAccountCount(user2), 3);
        
        for (uint256 i = 0; i < accounts.length; i++) {
            assertEq(InfoPilotSmartAccount(payable(accounts[i])).owner(), user2);
        }
    }

    function testGetUserAccounts() public {
        vm.startPrank(user2);
        factory.createAccount();
        factory.createAccount();
        vm.stopPrank();
        
        address[] memory accounts = factory.getUserAccounts(user2);
        assertEq(accounts.length, 2);
    }

    // ============ Rule Creation Tests ============

    function testSetRule() public {
        vm.prank(user);
        
        vm.expectEmit(true, false, false, true);
        emit RuleCreated(BTC_FEED_ID, "BTC", 90000 * 10**18, -1);
        
        account.setRule(
            "BTC/USD",
            "BTC",
            90000 * 10**18,  // $90k threshold
            true,            // trigger when price below
            -1,              // negative sentiment
            5000,            // 50% swap
            address(tokenA),
            address(tokenB)
        );
        
        (
            bytes21 feedId,
            string memory symbol,
            uint256 threshold,
            bool isBelow,
            int8 sentiment,
            uint256 percentage,
            address tknIn,
            address tknOut,
            bool active,
        ) = account.currentRule();
        
        assertEq(feedId, BTC_FEED_ID);
        assertEq(symbol, "BTC");
        assertEq(threshold, 90000 * 10**18);
        assertTrue(isBelow);
        assertEq(sentiment, -1);
        assertEq(percentage, 5000);
        assertEq(tknIn, address(tokenA));
        assertEq(tknOut, address(tokenB));
        assertTrue(active);
    }

    function testSetRuleOnlyOwner() public {
        vm.prank(user2);
        vm.expectRevert("Only owner can call");
        account.setRule(
            "BTC/USD",
            "BTC",
            90000 * 10**18,
            true,
            -1,
            5000,
            address(tokenA),
            address(tokenB)
        );
    }

    function testSetRuleInvalidParameters() public {
        vm.startPrank(user);
        
        // Invalid price threshold
        vm.expectRevert("Invalid price threshold");
        account.setRule("BTC/USD", "BTC", 0, true, -1, 5000, address(tokenA), address(tokenB));
        
        // Invalid sentiment
        vm.expectRevert("Invalid sentiment");
        account.setRule("BTC/USD", "BTC", 90000 * 10**18, true, -2, 5000, address(tokenA), address(tokenB));
        
        // Invalid percentage
        vm.expectRevert("Invalid percentage");
        account.setRule("BTC/USD", "BTC", 90000 * 10**18, true, -1, 0, address(tokenA), address(tokenB));
        
        vm.expectRevert("Invalid percentage");
        account.setRule("BTC/USD", "BTC", 90000 * 10**18, true, -1, 10001, address(tokenA), address(tokenB));
        
        // Same token swap
        vm.expectRevert("Same token swap not allowed");
        account.setRule("BTC/USD", "BTC", 90000 * 10**18, true, -1, 5000, address(tokenA), address(tokenA));
        
        vm.stopPrank();
    }

    // ============ Evaluation Tests ============

    function testEvaluateSuccess() public {
        // Setup: Create rule
        vm.prank(user);
        account.setRule(
            "BTC/USD",
            "BTC",
            90000 * 10**18,
            true,
            -1,
            5000,
            address(tokenA),
            address(tokenB)
        );
        
        // Setup: Set conditions to trigger
        MockFtsoV2(mockFtsoV2).setPrice(BTC_FEED_ID, 89000 * 10**18); // Below threshold
        sentimentOracle.updateSentiment("BTC", -1); // Negative
        
        // Execute
        uint256 balanceBefore = tokenA.balanceOf(address(account));
        
        vm.expectEmit(true, true, false, false);
        emit AutoSwapExecuted(address(tokenA), address(tokenB), 0, 0, 0);
        
        bool executed = account.evaluate();
        
        assertTrue(executed);
        assertLt(tokenA.balanceOf(address(account)), balanceBefore);
        assertGt(tokenB.balanceOf(address(account)), 0);
        
        // Rule should be deactivated
        (, , , , , , , , bool active, ) = account.currentRule();
        assertFalse(active);
    }

    function testEvaluatePriceConditionNotMet() public {
        vm.prank(user);
        account.setRule(
            "BTC/USD",
            "BTC",
            90000 * 10**18,
            true,
            -1,
            5000,
            address(tokenA),
            address(tokenB)
        );
        
        // Price above threshold
        MockFtsoV2(mockFtsoV2).setPrice(BTC_FEED_ID, 95000 * 10**18);
        sentimentOracle.updateSentiment("BTC", -1);
        
        bool executed = account.evaluate();
        assertFalse(executed);
        
        // Rule still active
        (, , , , , , , , bool active, ) = account.currentRule();
        assertTrue(active);
    }

    function testEvaluateSentimentConditionNotMet() public {
        vm.prank(user);
        account.setRule(
            "BTC/USD",
            "BTC",
            90000 * 10**18,
            true,
            -1,
            5000,
            address(tokenA),
            address(tokenB)
        );
        
        // Price condition met, but sentiment is positive
        MockFtsoV2(mockFtsoV2).setPrice(BTC_FEED_ID, 89000 * 10**18);
        sentimentOracle.updateSentiment("BTC", 1); // Positive instead of negative
        
        bool executed = account.evaluate();
        assertFalse(executed);
    }

    function testEvaluateBothConditionsNotMet() public {
        vm.prank(user);
        account.setRule(
            "BTC/USD",
            "BTC",
            90000 * 10**18,
            true,
            -1,
            5000,
            address(tokenA),
            address(tokenB)
        );
        
        MockFtsoV2(mockFtsoV2).setPrice(BTC_FEED_ID, 95000 * 10**18);
        sentimentOracle.updateSentiment("BTC", 1);
        
        bool executed = account.evaluate();
        assertFalse(executed);
    }

    function testEvaluatePriceAboveThreshold() public {
        vm.prank(user);
        account.setRule(
            "BTC/USD",
            "BTC",
            100000 * 10**18,
            false, // trigger when price ABOVE
            1,     // positive sentiment
            5000,
            address(tokenA),
            address(tokenB)
        );
        
        MockFtsoV2(mockFtsoV2).setPrice(BTC_FEED_ID, 105000 * 10**18);
        sentimentOracle.updateSentiment("BTC", 1);
        
        bool executed = account.evaluate();
        assertTrue(executed);
    }

    // ============ View Function Tests ============

    function testCheckConditions() public {
        vm.prank(user);
        account.setRule(
            "BTC/USD",
            "BTC",
            90000 * 10**18,
            true,
            -1,
            5000,
            address(tokenA),
            address(tokenB)
        );
        
        // Both conditions met
        MockFtsoV2(mockFtsoV2).setPrice(BTC_FEED_ID, 89000 * 10**18);
        sentimentOracle.updateSentiment("BTC", -1);
        
        (bool wouldExecute, bool priceOk, bool sentimentOk) = account.checkConditions();
        assertTrue(wouldExecute);
        assertTrue(priceOk);
        assertTrue(sentimentOk);
        
        // Only price met
        sentimentOracle.updateSentiment("BTC", 0);
        (wouldExecute, priceOk, sentimentOk) = account.checkConditions();
        assertFalse(wouldExecute);
        assertTrue(priceOk);
        assertFalse(sentimentOk);
    }

    function testGetCurrentPrice() public {
        vm.prank(user);
        account.setRule(
            "BTC/USD",
            "BTC",
            90000 * 10**18,
            true,
            -1,
            5000,
            address(tokenA),
            address(tokenB)
        );
        
        uint256 testPrice = 92000 * 10**18;
        MockFtsoV2(mockFtsoV2).setPrice(BTC_FEED_ID, testPrice);
        
        (uint256 price, ) = account.getCurrentPrice();
        assertEq(price, testPrice);
    }

    function testGetCurrentSentiment() public {
        vm.prank(user);
        account.setRule(
            "BTC/USD",
            "BTC",
            90000 * 10**18,
            true,
            -1,
            5000,
            address(tokenA),
            address(tokenB)
        );
        
        sentimentOracle.updateSentiment("BTC", 1);
        
        (int8 sentiment, ) = account.getCurrentSentiment();
        assertEq(sentiment, 1);
    }

    function testGetTokenBalance() public view {
        uint256 balance = account.getTokenBalance(address(tokenA));
        assertEq(balance, INITIAL_BALANCE);
    }

    function testGetExecutionCount() public {
        vm.prank(user);
        account.setRule(
            "BTC/USD",
            "BTC",
            90000 * 10**18,
            true,
            -1,
            5000,
            address(tokenA),
            address(tokenB)
        );
        
        MockFtsoV2(mockFtsoV2).setPrice(BTC_FEED_ID, 89000 * 10**18);
        sentimentOracle.updateSentiment("BTC", -1);
        
        assertEq(account.getExecutionCount(), 0);
        
        account.evaluate();
        
        assertEq(account.getExecutionCount(), 1);
    }

    // ============ Admin Function Tests ============

    function testDeactivateRule() public {
        vm.prank(user);
        account.setRule(
            "BTC/USD",
            "BTC",
            90000 * 10**18,
            true,
            -1,
            5000,
            address(tokenA),
            address(tokenB)
        );
        
        vm.prank(user);
        account.deactivateRule();
        
        (, , , , , , , , bool active, ) = account.currentRule();
        assertFalse(active);
    }

    function testWithdrawToken() public {
        uint256 withdrawAmount = 1000 * 10**18;
        uint256 initialBalance = tokenA.balanceOf(user);
        
        vm.prank(user);
        account.withdrawToken(address(tokenA), withdrawAmount);
        
        assertEq(tokenA.balanceOf(user), initialBalance + withdrawAmount);
    }

    function testTransferOwnership() public {
        vm.prank(user);
        account.transferOwnership(user2);
        
        assertEq(account.owner(), user2);
    }

    // ============ Edge Cases ============

    function testEvaluateWithInsufficientBalance() public {
        // Create account with no tokens
        vm.prank(user2);
        address emptyAccount = factory.createAccount();
        InfoPilotSmartAccount empty = InfoPilotSmartAccount(payable(emptyAccount));
        
        vm.prank(user2);
        empty.setRule(
            "BTC/USD",
            "BTC",
            90000 * 10**18,
            true,
            -1,
            5000,
            address(tokenA),
            address(tokenB)
        );
        
        MockFtsoV2(mockFtsoV2).setPrice(BTC_FEED_ID, 89000 * 10**18);
        sentimentOracle.updateSentiment("BTC", -1);
        
        vm.expectRevert("Insufficient balance to swap");
        empty.evaluate();
    }

    function testSwapWithDifferentPercentages() public {
        uint256[] memory percentages = new uint256[](4);
        percentages[0] = 2500; // 25%
        percentages[1] = 5000; // 50%
        percentages[2] = 7500; // 75%
        percentages[3] = 10000; // 100%
        
        for (uint256 i = 0; i < percentages.length; i++) {
            // Create new account for each test
            vm.prank(user);
            address newAccountAddr = factory.createAccount();
            InfoPilotSmartAccount newAccount = InfoPilotSmartAccount(payable(newAccountAddr));
            tokenA.mint(address(newAccount), INITIAL_BALANCE);
            
            vm.prank(user);
            newAccount.setRule(
                "BTC/USD",
                "BTC",
                90000 * 10**18,
                true,
                -1,
                percentages[i],
                address(tokenA),
                address(tokenB)
            );
            
            MockFtsoV2(mockFtsoV2).setPrice(BTC_FEED_ID, 89000 * 10**18);
            sentimentOracle.updateSentiment("BTC", -1);
            
            uint256 balanceBefore = tokenA.balanceOf(address(newAccount));
            newAccount.evaluate();
            uint256 balanceAfter = tokenA.balanceOf(address(newAccount));
            
            uint256 expectedSwapped = (balanceBefore * percentages[i]) / 10000;
            uint256 actualSwapped = balanceBefore - balanceAfter;
            
            assertEq(actualSwapped, expectedSwapped);
        }
    }
}

// ============ Mock Contracts for Testing ============

contract MockFtsoV2 is IFtsoV2 {
    mapping(bytes21 => uint256) public prices;
    mapping(bytes21 => uint64) public timestamps;
    
    function setPrice(bytes21 feedId, uint256 price) external {
        prices[feedId] = price;
        timestamps[feedId] = uint64(block.timestamp);
    }
    
    function getFeedById(bytes21 _feedId)
        external
        payable
        override
        returns (uint256 _value, int8 _decimals, uint64 _timestamp)
    {
        return (prices[_feedId] / 10**18, 18, timestamps[_feedId]);
    }
    
    function getFeedByIdInWei(bytes21 _feedId)
        external
        payable
        override
        returns (uint256 _value, uint64 _timestamp)
    {
        return (prices[_feedId], timestamps[_feedId]);
    }
    
    function getFeedsById(bytes21[] memory)
        external
        payable
        override
        returns (uint256[] memory, int8[] memory, uint64)
    {
        revert("Not implemented");
    }
    
    function getFeedsByIdInWei(bytes21[] memory)
        external
        payable
        override
        returns (uint256[] memory, uint64)
    {
        revert("Not implemented");
    }
    
    function getSupportedFeedIds() external pure override returns (bytes21[] memory) {
        revert("Not implemented");
    }
}

contract MockFeedConverter is IFtsoFeedIdConverter {
    function getFeedId(uint8, string memory) external pure override returns (bytes21) {
        return bytes21(uint168(1)); // Return constant feed ID for testing
    }
    
    function getFeedCategoryAndName(bytes21)
        external
        pure
        override
        returns (uint8, string memory)
    {
        return (1, "BTC/USD");
    }
}
