# InfoPilot Smart Contracts

## 🚀 Overview

InfoPilot is an autonomous trading agent powered by Flare Network's data infrastructure. It combines real-time price feeds (FTSO) with off-chain intelligence (FDC simulation) to create the first **Information Finance (InfoFi)** protocol.

### Key Features

- **Multi-Source Decision Engine**: Combines FTSO price feeds + sentiment data
- **Autonomous Execution**: Smart accounts that auto-execute trades based on rules
- **User-Defined Rules**: Set custom conditions for portfolio rebalancing
- **Information Finance**: Trade on intelligence, not just price

## 📁 Contract Architecture

```
src/
├── InfoPilotSmartAccount.sol    # Main autonomous trading account
├── InfoPilotFactory.sol         # Factory for creating user accounts
├── interfaces/
│   ├── IFtsoV2.sol             # Flare FTSO V2 price feed interface
│   ├── IFtsoFeedIdConverter.sol # Feed ID converter interface
│   ├── IERC20.sol              # Standard ERC20 interface
│   ├── ISentimentOracle.sol    # Sentiment oracle interface
│   └── IDEXRouter.sol          # DEX router interface
└── mocks/
    ├── MockSentimentOracle.sol  # Mock FDC sentiment oracle
    ├── MockDEX.sol             # Mock DEX for testing
    └── MockERC20.sol           # Mock ERC20 tokens
```

## 🛠 Setup & Installation

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js (for frontend integration)
- Git

### Installation

```bash
cd sc
forge install
forge build
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test testEvaluateSuccess

# Generate gas report
forge test --gas-report
```

### Test Coverage

The test suite covers:
- ✅ Factory deployment and account creation
- ✅ Rule creation and validation
- ✅ Price and sentiment condition evaluation
- ✅ Automatic swap execution
- ✅ View functions and state queries
- ✅ Admin functions and access control
- ✅ Edge cases and error handling

## 🚀 Deployment

### Deploy to Coston2 Testnet

1. **Setup environment variables**:

```bash
# Edit .env and add your private key
PRIVATE_KEY=0x...
FLARESCAN_API_KEY=your_api_key
```

2. **Deploy contracts**:

```bash
# Deploy full InfoPilot system
forge script script/DeployInfoPilot.s.sol:DeployInfoPilot \
  --rpc-url coston2 \
  --broadcast \
  --verify

# Or use the RPC URL directly
forge script script/DeployInfoPilot.s.sol:DeployInfoPilot \
  --rpc-url https://coston2.enosys.global/ext/C/rpc \
  --broadcast
```

3. **Verify contracts** (if not done automatically):

```bash
forge verify-contract <CONTRACT_ADDRESS> \
  src/InfoPilotFactory.sol:InfoPilotFactory \
  --chain-id 114 \
  --etherscan-api-key $FLARESCAN_API_KEY
```

### Deployment Output

After deployment, contract addresses are saved to `deployments/coston2-latest.json`.

## 📝 Contract Addresses (Coston2)

### Flare Protocol Contracts

| Contract | Address |
|----------|---------|
| FTSO V2 | `0x7BDE3Df0624114eDB3A67dFe6753e62f4e7c1d20` |
| Feed ID Converter | `0xafEa60cabb2daB413D17b85Db82cCf6EB06a0F66` |

### InfoPilot Contracts

After deployment, your contracts will be listed in `deployments/coston2-latest.json`.

## 💡 Usage Examples

### Create a New Trading Account

```solidity
// Get factory instance
InfoPilotFactory factory = InfoPilotFactory(FACTORY_ADDRESS);

// Create account
address account = factory.createAccount();
```

### Set a Trading Rule

```solidity
InfoPilotSmartAccount account = InfoPilotSmartAccount(YOUR_ACCOUNT);

// Rule: If BTC price < $90k AND sentiment is negative, swap 50% to stablecoin
account.setRule(
    "BTC/USD",           // Price feed name
    "BTC",               // Asset for sentiment
    90000 * 10**18,      // Price threshold (in wei)
    true,                // Trigger when price is below
    -1,                  // Negative sentiment
    5000,                // 50% of balance (basis points)
    tokenA,              // Token to swap from
    tokenB               // Token to swap to
);
```

### Evaluate Conditions

```solidity
// Check if conditions would trigger
(bool wouldExecute, bool priceOk, bool sentimentOk) = account.checkConditions();

// Execute if conditions are met
bool executed = account.evaluate();
```

## 🔐 Security Considerations

### Current Implementation (Testnet)

- ✅ Owner-only functions protected
- ✅ Input validation on all parameters
- ✅ Safe ERC20 interactions
- ⚠️ Mock contracts for testing only

### Production Recommendations

1. **Audit**: Get professional security audit
2. **Multisig**: Use multisig for admin functions
3. **Slippage**: Implement slippage protection for swaps
4. **Real FDC**: Integrate actual Flare Data Connector

## 📄 License

MIT License

## 🔗 Resources

- [Flare Developer Docs](https://dev.flare.network/)
- [FTSO Documentation](https://dev.flare.network/ftso/)
- [FDC Documentation](https://dev.flare.network/fdc/)
- [Foundry Book](https://book.getfoundry.sh/)

---

Built with ❤️ for the Flare Hackathon

