# InfoPilot Quick Reference Guide

## 🚀 Deployment Commands

### Build
```bash
cd sc
forge build
```

### Test
```bash
forge test -vv                    # All tests with logs
forge test --match-test testName  # Specific test
forge test --gas-report          # With gas report
```

### Deploy to Coston2
```bash
# Using helper script (recommended)
./deploy.sh

# Manual deployment
forge script script/DeployInfoPilot.s.sol:DeployInfoPilot \
  --rpc-url https://coston2.enosys.global/ext/C/rpc \
  --broadcast \
  --legacy
```

---

## 📝 Contract Addresses

### Coston2 Testnet

**Flare Protocol (Fixed):**
```javascript
FTSO_V2 = "0x7BDE3Df0624114eDB3A67dFe6753e62f4e7c1d20"
FEED_CONVERTER = "0xafEa60cabb2daB413D17b85Db82cCf6EB06a0F66"
```

**InfoPilot Contracts (After Deployment):**
See `deployments/coston2-latest.json`

---

## 🔧 Contract Interactions

### Factory Contract

```solidity
// Create new account
address account = factory.createAccount();

// Create multiple accounts
address[] memory accounts = factory.createMultipleAccounts(3);

// Get user's accounts
address[] memory myAccounts = factory.getUserAccounts(msg.sender);

// Get total accounts created
uint256 total = factory.getTotalAccountCount();

// Get configuration
(address ftso, address converter, address oracle, address dex) = 
    factory.getConfiguration();
```

### Smart Account Contract

#### Set Trading Rule
```solidity
account.setRule(
    "BTC/USD",           // Feed name (e.g., "BTC/USD", "FLR/USD", "ETH/USD")
    "BTC",               // Asset symbol for sentiment
    90000 * 10**18,      // Price threshold in wei (18 decimals)
    true,                // true = trigger when below, false = trigger when above
    -1,                  // Sentiment: -1 (negative), 0 (neutral), 1 (positive)
    5000,                // Swap percentage in basis points (5000 = 50%, 10000 = 100%)
    address(tokenFrom),  // Token to swap from
    address(tokenTo)     // Token to swap to
);
```

#### Evaluate & Execute
```solidity
// Check if conditions would trigger (no state change)
(bool wouldExecute, bool priceOk, bool sentimentOk) = account.checkConditions();

// Get current price
(uint256 price, uint64 timestamp) = account.getCurrentPrice();

// Get current sentiment
(int8 sentiment, uint64 timestamp) = account.getCurrentSentiment();

// Execute if conditions are met
bool executed = account.evaluate();
```

#### Query State
```solidity
// Get rule details
(
    bytes21 feedId,
    string memory symbol,
    uint256 threshold,
    bool isBelow,
    int8 sentiment,
    uint256 percentage,
    address tokenIn,
    address tokenOut,
    bool active,
    uint64 createdAt
) = account.currentRule();

// Get execution history
uint256 count = account.getExecutionCount();
ExecutionLog memory log = account.getExecution(0);

// Get token balance
uint256 balance = account.getTokenBalance(tokenAddress);
```

#### Admin Functions
```solidity
// Deactivate current rule
account.deactivateRule();

// Withdraw tokens
account.withdrawToken(tokenAddress, amount);

// Withdraw native FLR
account.withdrawNative(amount);

// Transfer ownership
account.transferOwnership(newOwner);
```

---

## 📊 Example Trading Rules

### 1. Bear Market Protection
```solidity
// "If BTC drops below $85k AND sentiment is negative, move 75% to stablecoin"
account.setRule(
    "BTC/USD",
    "BTC",
    85000 * 10**18,
    true,              // below
    -1,                // negative
    7500,              // 75%
    WFLR,
    USDC
);
```

### 2. Bull Market Entry
```solidity
// "If ETH goes above $4k AND sentiment is positive, swap 30% from stable to ETH"
account.setRule(
    "ETH/USD",
    "ETH",
    4000 * 10**18,
    false,             // above
    1,                 // positive
    3000,              // 30%
    USDC,
    WETH
);
```

### 3. Neutral Rebalance
```solidity
// "If FLR is at $0.05 AND sentiment is neutral, rebalance 50%"
account.setRule(
    "FLR/USD",
    "FLR",
    5 * 10**16,        // 0.05 USD
    true,              // below
    0,                 // neutral
    5000,              // 50%
    WFLR,
    USDT
);
```

---

## 🧪 Testing Locally

### Setup Test Environment
```solidity
// In your test or script
MockSentimentOracle oracle = MockSentimentOracle(ORACLE_ADDRESS);
MockDEX dex = MockDEX(DEX_ADDRESS);

// Update sentiment
oracle.updateSentiment("BTC", -1);  // Set to negative

// Price is fetched automatically from FTSO
```

### Test Rule Execution
```solidity
// 1. Fund account
token.transfer(accountAddress, 10000 * 10**18);

// 2. Set rule
account.setRule(...);

// 3. Set conditions
oracle.updateSentiment("BTC", -1);
// Price from FTSO should be below threshold

// 4. Evaluate
bool executed = account.evaluate();
console.log("Executed:", executed);

// 5. Check balances
uint256 balanceA = tokenA.balanceOf(accountAddress);
uint256 balanceB = tokenB.balanceOf(accountAddress);
```

---

## 🎯 Cast Commands (CLI Interaction)

### Read Functions
```bash
# Get user accounts
cast call $FACTORY "getUserAccounts(address)(address[])" $USER_ADDRESS \
  --rpc-url https://coston2.enosys.global/ext/C/rpc

# Check conditions
cast call $ACCOUNT "checkConditions()(bool,bool,bool)" \
  --rpc-url https://coston2.enosys.global/ext/C/rpc

# Get current price
cast call $ACCOUNT "getCurrentPrice()(uint256,uint64)" \
  --rpc-url https://coston2.enosys.global/ext/C/rpc
```

### Write Functions
```bash
# Create account
cast send $FACTORY "createAccount()" \
  --private-key $PRIVATE_KEY \
  --rpc-url https://coston2.enosys.global/ext/C/rpc

# Evaluate rule
cast send $ACCOUNT "evaluate()" \
  --private-key $PRIVATE_KEY \
  --rpc-url https://coston2.enosys.global/ext/C/rpc
```

---

## 🔍 Event Monitoring

### Key Events

```solidity
// Factory
event AccountCreated(address indexed user, address indexed account, uint256 accountIndex, uint256 timestamp);

// Smart Account
event RuleCreated(bytes21 indexed feedId, string assetSymbol, uint256 priceThreshold, int8 sentimentCondition);
event RuleEvaluated(bool priceConditionMet, bool sentimentConditionMet, uint256 currentPrice, int8 currentSentiment);
event AutoSwapExecuted(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut, uint256 timestamp);
event RuleDeactivated(uint256 timestamp);
```

### Monitor with Cast
```bash
# Watch for new accounts
cast logs --address $FACTORY \
  "AccountCreated(address indexed,address indexed,uint256,uint256)" \
  --rpc-url https://coston2.enosys.global/ext/C/rpc

# Watch for rule executions
cast logs --address $ACCOUNT \
  "AutoSwapExecuted(address indexed,address indexed,uint256,uint256,uint256)" \
  --rpc-url https://coston2.enosys.global/ext/C/rpc
```

---

## 💡 Tips & Best Practices

### Setting Price Thresholds
- Always use 18 decimals: `price * 10**18`
- Example: $90,000 = `90000 * 10**18`
- Example: $0.05 = `5 * 10**16`

### Swap Percentages
- Use basis points: 100% = 10000
- 50% = 5000
- 25% = 2500
- 10% = 1000

### Sentiment Values
- `-1` = Negative (bearish)
- `0` = Neutral
- `1` = Positive (bullish)

### Gas Optimization
- Check conditions off-chain before calling `evaluate()`
- Batch account creation when needed
- Deactivate unused rules

---

## 🐛 Troubleshooting

### Common Errors

**"No active rule"**
- Solution: Set a rule first using `setRule()`

**"Only owner can call"**
- Solution: Call from the account owner address

**"Insufficient balance to swap"**
- Solution: Fund the account with tokens first

**"Invalid percentage"**
- Solution: Use 1-10000 range (basis points)

**"Same token swap not allowed"**
- Solution: Use different tokens for tokenIn and tokenOut

---

## 📚 Additional Resources

- Smart Contract Source: `sc/src/`
- Tests: `sc/test/InfoPilot.t.sol`
- Deployment: `sc/script/DeployInfoPilot.s.sol`
- Documentation: `sc/README.md`

---

**Need Help?**
- Check test files for usage examples
- Review deployment script for setup
- Read inline code comments

---

Happy Trading! 🚀
