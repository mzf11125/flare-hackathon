# 🚀 InfoPilot – Autonomous Information Finance Agent

### **Self-Driving Smart Account Powered by Flare FDC + FTSO + Smart Accounts**

InfoPilot is an **autonomous trading and risk-mitigation agent** built on the Flare Network.
It reacts not only to **on-chain price data** but also to **real-world signals**, using:

* **FTSO** → Decentralized on-chain price feeds
* **FDC (Flare Data Connector)** → Off-chain structured signals (sentiment, social activity, indicators, etc.)
* **Flare Smart Accounts** → Automated programmable wallet execution
* **Coston2 Testnet** → Fully demo-ready

Together, they power a **self-driving on-chain wallet** that reallocates assets based on information, not just raw price.

---

# 🎯 1. Overview

Modern markets move based on *information*, not only price.
So we built **InfoPilot** — a Smart Account that makes autonomous trading decisions based on **combined off-chain signals + real-time prices**, creating a new category:

# 🔥 **Information Finance (InfoFi)**

A wallet that acts on *signals, sentiment, triggers,* and *data* — not just price.

InfoPilot monitors market conditions via FDC and price movements via FTSO. When both conditions align, it automatically executes protective or opportunistic trades.

### Example rule:

> **“If BTC sentiment turns negative (FDC) AND price drops below $90k (FTSO), move 50% to stable assets.”**

This transforms Flare’s data infrastructure into a **real, automated decision engine.**

---

# ⭐ 2. Unique Selling Proposition (USP)

### 🧠 **Multi-Source Decision Engine**

The first wallet to use **both**:

* Off-chain intelligence (FDC)
* On-chain pricing truth (FTSO)

### 🤖 **Autonomous Smart Account Execution**

Flare Account Abstraction executes trades without user intervention.

### 🌐 **True Information Finance Protocol**

Moves beyond “price triggers” into **real information-driven automation**, aligning perfectly with Flare’s vision.

### ⚡ **Hackable in 5 hours, visionary in concept**

Simple architecture, extremely strong narrative.

---

# 🏗 3. System Architecture

```
                 ┌─────────────────────────────────────────────┐
                 │                 FDC Feed                     │
                 │  e.g. BTC sentiment: positive/neutral/neg    │
                 └─────────────────────────────────────────────┘
                                 │
                                 ▼
                 ┌─────────────────────────────────────────────┐
                 │                 FTSO Feed                    │
                 │        e.g. BTC/USD price = X               │
                 └─────────────────────────────────────────────┘
                                 │
                                 ▼
                        Combined Decision Layer
                (SmartAccount: evaluate {signal + price})
                                 │
                                 ▼
                 ┌─────────────────────────────────────────────┐
                 │           AutoSwap Executor                 │
                 │        Swap / Move funds / Rebalance        │
                 └─────────────────────────────────────────────┘
                                 │
                                 ▼
                      User Portfolio Reallocation
```

---

# 🧠 4. How It Works

### 1️⃣ User defines a rule

From the UI, the user sets:

* Asset to monitor (BTC, FLR, etc.)
* FDC sentiment threshold (negative, high, spike, etc.)
* FTSO price threshold
* Action (swap %, move to stablecoin, reallocate)

### 2️⃣ Smart Account saves rule

Rules stored in contract as:

```solidity
struct InfoRule {
    uint256 priceThreshold;
    int8 sentimentCondition; // -1 = negative, 0 = neutral, +1 = positive
    uint256 amount;
    bool active;
}
```

### 3️⃣ InfoPilot monitors info

* Uses **FTSO** for real-time price
* Uses **FDC** for off-chain sentiment

### 4️⃣ When both match → Auto-execute

Smart Account runs `evaluate()`:

```
if sentiment == negative AND price < threshold:
    executeAutoSwap();
```

### 5️⃣ Portfolio updates automatically

User sees "Trade executed ✔" on UI.

---

# 🛠 5. Tech Stack

### On-Chain

* Solidity
* Hardhat (or Foundry)
* Flare FTSO Registry
* Flare Data Connector (FDC)
* Smart Accounts Framework

### Frontend

* Next.js
* MetaMask
* Wagmi / ethers.js
* Privvy

---

# ⚙ 6. Smart Contract (Simplified)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IFDCFeed {
    function getValue() external view returns (int8); // sentiment
}

interface IFTSORegistry {
    function getCurrentPrice(bytes32 symbol)
        external
        view
        returns (uint256 price, uint256 timestamp);
}

contract InfoPilotSmartAccount {

    struct InfoRule {
        uint256 priceThreshold;
        int8 sentimentCondition;
        uint256 amount;
        bool active;
    }

    IFDCFeed public sentimentFeed;
    IFTSORegistry public ftso;

    InfoRule public rule;

    constructor(address _sentiment, address _ftso) {
        sentimentFeed = IFDCFeed(_sentiment);
        ftso = IFTSORegistry(_ftso);
    }

    function setRule(
        uint256 priceThreshold,
        int8 sentimentCondition,
        uint256 amount
    ) external {
        rule = InfoRule(priceThreshold, sentimentCondition, amount, true);
    }

    function evaluate() external {
        require(rule.active, "inactive");

        (uint256 price, ) = ftso.getCurrentPrice("BTC/USD");
        int8 sentiment = sentimentFeed.getValue();

        bool okPrice = price <= rule.priceThreshold;
        bool okSent = sentiment == rule.sentimentCondition;

        if (okPrice && okSent) {
            _autoSwap(rule.amount);
            rule.active = false;
        }
    }

    function _autoSwap(uint256 amt) internal {
        // mock swap for hackathon demo
    }
}
```

---

# 🧪 7. Demo Flow for Judges

1. **User creates rule:**
   “If BTC sentiment is negative AND price < $90k → move 20% to stablecoin.”

2. **Show real-time FDC value**
   “Sentiment = negative”

3. **Show FTSO price feed**
   “BTC = $89,500”

4. **Click `Evaluate()`**
   Smart account auto-executes the action.

5. **Portfolio updates**
   Dashboard shows:
   ✔ Auto-swap executed
   ✔ Rule completed
   ✔ Smart Account automated action

Instant “wow” moment.

---

# 📦 8. Run Locally

### 1. Clone

```bash
git clone https://github.com/yourproject/infopilot
cd infopilot
```

### 2. Install

```bash
npm install
```

### 3. Deploy

```bash
npx hardhat run scripts/deploy.js --network coston2
```

### 4. Start frontend

```bash
npm run dev
```

---

# 🚨 9. Flare Requirements Fulfilled

| Requirement    | Status                                  |
| -------------- | --------------------------------------- |
| FTSO           | ✅ Used for price-based triggers         |
| FDC            | ✅ Used for sentiment/real-world signals |
| Smart Accounts | ✅ Used for autonomous execution         |
| Flare Testnet  | ✅ Coston2 demo-ready                    |

---

# 🔮 10. Future Extensions

* Use FAssets to bring BTC/ETH liquidity on-chain
* Multi-rule strategies (grid trading, hedging, DCA)
* Complex data: Google trends, volatility indices
* Cross-chain reactions using bridges
* Fully autonomous background agent (cron automation)

---

# 🏁 11. Final 30-Second Pitch

> **InfoPilot** is a self-driving smart account powered by Flare’s data infrastructure.
> It combines **FTSO price oracles** with **FDC off-chain intelligence** to create an autonomous wallet that reallocates assets based on real information, not just prices.
> This is the first “Information Finance Agent” on Flare — demonstrating the true power of multi-source data and programmable accounts.

