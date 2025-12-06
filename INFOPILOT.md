# 🚀 InfoPilot – Autonomous Information Finance Agent

### **Self-Driving Smart Account Powered by Flare FDC + FTSO + Smart Accounts**

[![Tests](https://img.shields.io/badge/tests-22%20passing-brightgreen)]()
[![Solidity](https://img.shields.io/badge/solidity-0.8.21-blue)]()
[![Network](https://img.shields.io/badge/network-Coston2-orange)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

InfoPilot is an **autonomous trading and risk-mitigation agent** built on the Flare Network. It reacts not only to **on-chain price data** but also to **real-world signals**, using:

* **FTSO** → Decentralized on-chain price feeds
* **FDC (Flare Data Connector)** → Off-chain structured signals (sentiment, social activity, indicators)
* **Smart Accounts** → Automated programmable wallet execution
* **Coston2 Testnet** → Fully demo-ready

Together, they power a **self-driving on-chain wallet** that reallocates assets based on information, not just raw price.

---

## 🔥 Information Finance (InfoFi)

**InfoFi** = A wallet that acts on *signals, sentiment, triggers,* and *data* — not just price.

### Example Rule:
> **"If BTC sentiment turns negative (FDC) AND price drops below $90k (FTSO), move 50% to stable assets."**

This transforms Flare's data infrastructure into a **real, automated decision engine.**

---

## ⭐ Unique Selling Proposition (USP)

### 🧠 Multi-Source Decision Engine
The first wallet to use **both**:
- Off-chain intelligence (FDC)
- On-chain pricing truth (FTSO)

### 🤖 Autonomous Smart Account Execution
Account abstraction executes trades without user intervention.

### 🌐 True Information Finance Protocol
Moves beyond "price triggers" into **real information-driven automation**.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────┐
│              FDC Feed (Mock)                │
│   e.g. BTC sentiment: positive/neutral/neg  │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│              FTSO Feed (Real)                │
│        e.g. BTC/USD price = X               │
└─────────────────────────────────────────────┘
                    │
                    ▼
        Combined Decision Layer
   (SmartAccount: evaluate {signal + price})
                    │
                    ▼
┌─────────────────────────────────────────────┐
│        AutoSwap Executor (Mock DEX)         │
│     Swap / Move funds / Rebalance           │
└─────────────────────────────────────────────┘
                    │
                    ▼
        User Portfolio Reallocation
```

---

## 🚀 Quick Start

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Git

### Installation

```bash
# Clone repository
git clone <your-repo>
cd flare-hackathon

# Install smart contract dependencies
cd sc
forge install
forge build

# Run tests
forge test
```

### Deploy to Coston2

```bash
# Configure environment
cp sc/.env.example sc/.env
# Edit .env with your PRIVATE_KEY

# Deploy
cd sc
forge script script/DeployInfoPilot.s.sol:DeployInfoPilot \
  --rpc-url https://coston2.enosys.global/ext/C/rpc \
  --broadcast
```

---

## 📁 Project Structure

```
flare-hackathon/
├── sc/                          # Smart Contracts (Foundry)
│   ├── src/
│   │   ├── InfoPilotSmartAccount.sol   # Main autonomous account
│   │   ├── InfoPilotFactory.sol        # Factory contract
│   │   ├── interfaces/                 # Flare & standard interfaces
│   │   └── mocks/                      # Mock contracts for testing
│   ├── test/                    # Comprehensive test suite (22 tests)
│   ├── script/                  # Deployment scripts
│   └── foundry.toml            # Foundry configuration
├── fe/                         # Frontend (Next.js)
│   └── [Next.js app structure]
└── README.md
```

---

## 🧠 How It Works

### 1️⃣ User Defines a Rule
From the UI (or directly on-chain), set:
- Asset to monitor (BTC, FLR, etc.)
- FDC sentiment threshold (negative, neutral, positive)
- FTSO price threshold
- Action (swap %, move to stablecoin, reallocate)

### 2️⃣ Smart Account Saves Rule
Rules stored in contract:
```solidity
struct InfoRule {
    bytes21 priceFeedId;
    string assetSymbol;
    uint256 priceThreshold;
    bool isPriceBelow;
    int8 sentimentCondition;
    uint256 swapPercentage;
    address tokenIn;
    address tokenOut;
    bool active;
}
```

### 3️⃣ InfoPilot Monitors Conditions
- Uses **FTSO** for real-time price
- Uses **Mock Sentiment Oracle** (simulating FDC)

### 4️⃣ When Both Match → Auto-Execute
Smart Account runs `evaluate()`:
```solidity
if (priceConditionMet && sentimentConditionMet) {
    _executeAutoSwap();
}
```

### 5️⃣ Portfolio Updates Automatically
User sees "Trade executed ✔" on dashboard.

---

## 🛠 Tech Stack

### Smart Contracts
- Solidity 0.8.21
- Foundry (testing & deployment)
- Flare FTSO V2 (real price feeds)
- Mock FDC Sentiment Oracle
- Mock DEX (simulating Uniswap V2)

### Frontend
- Next.js 16
- TypeScript
- TailwindCSS
- Wagmi / ethers.js

---

## 📊 Test Results

```
✅ 22/22 Tests Passing

Test Coverage:
- Factory deployment & account creation
- Rule creation & validation
- Price & sentiment condition evaluation
- Automatic swap execution
- View functions & state queries
- Admin functions & access control
- Edge cases & error handling
```

Run tests yourself:
```bash
cd sc
forge test -vv
```

---

## 🚨 Flare Requirements Fulfilled

| Requirement    | Status                                  |
| -------------- | --------------------------------------- |
| FTSO           | ✅ Used for price-based triggers (real)  |
| FDC            | ✅ Simulated via MockSentimentOracle     |
| Smart Accounts | ✅ EOA-controlled autonomous execution   |
| Flare Testnet  | ✅ Coston2 ready                         |

---

## 📝 Contract Addresses

### Coston2 Testnet

**Flare Protocol** (Production):
- FTSO V2: `0x7BDE3Df0624114eDB3A67dFe6753e62f4e7c1d20`
- Feed Converter: `0xafEa60cabb2daB413D17b85Db82cCf6EB06a0F66`

**InfoPilot Contracts** (After Deployment):
See `sc/deployments/coston2-latest.json`

---

## 💡 Usage Example

```solidity
// 1. Create account via factory
address myAccount = factory.createAccount();
InfoPilotSmartAccount account = InfoPilotSmartAccount(myAccount);

// 2. Fund account with tokens
tokenA.transfer(myAccount, 10000 * 10**18);

// 3. Set trading rule
account.setRule(
    "BTC/USD",           // Price feed
    "BTC",               // Asset for sentiment
    90000 * 10**18,      // $90k threshold
    true,                // Trigger when below
    -1,                  // Negative sentiment
    5000,                // 50% swap
    address(tokenA),     // From token
    address(tokenB)      // To token
);

// 4. Evaluate conditions (can be called by anyone or automated)
bool executed = account.evaluate();

// 5. Check execution history
uint256 count = account.getExecutionCount();
```

---

## 🔮 Future Extensions

- [ ] Use FAssets to bring BTC/ETH liquidity on-chain
- [ ] Multi-rule strategies (grid trading, hedging, DCA)
- [ ] Complex data: Google trends, volatility indices
- [ ] Cross-chain reactions using bridges
- [ ] Fully autonomous background agent (cron automation)
- [ ] Integration with real FDC JsonApi attestations

---

## 🎯 Demo Flow for Judges

1. **User creates rule:**
   "If BTC sentiment is negative AND price < $90k → move 20% to stablecoin."

2. **Show real-time FDC value** (mock)
   "Sentiment = negative"

3. **Show FTSO price feed** (real)
   "BTC = $89,500"

4. **Click `Evaluate()`**
   Smart account auto-executes the action.

5. **Portfolio updates**
   Dashboard shows:
   - ✔ Auto-swap executed
   - ✔ Rule completed
   - ✔ Smart Account automated action

---

## 🏁 30-Second Pitch

> **InfoPilot** is a self-driving smart account powered by Flare's data infrastructure.
> It combines **FTSO price oracles** with **FDC off-chain intelligence** to create an autonomous wallet that reallocates assets based on real information, not just prices.
> This is the first **"Information Finance Agent"** on Flare — demonstrating the true power of multi-source data and programmable accounts.

---

## 📄 License

MIT License

---

## 🔗 Resources

- [Smart Contract Documentation](sc/README.md)
- [Flare Developer Docs](https://dev.flare.network/)
- [FTSO Documentation](https://dev.flare.network/ftso/)
- [FDC Documentation](https://dev.flare.network/fdc/)

---

**Built with ❤️ for the Flare Hackathon**
