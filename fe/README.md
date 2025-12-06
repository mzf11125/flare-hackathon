# InfoPilot Frontend

Web3 dApp for autonomous trading on Flare Network using FTSO price feeds and FDC sentiment data.

## 🚀 Quick Start

```bash
cd fe
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
fe/
├── app/
│   ├── dashboard/        # Portfolio & rule monitoring
│   ├── rules/            # Create trading rules
│   ├── execute/          # Manual rule evaluation
│   ├── feeds/            # Live price & sentiment data
│   └── page.tsx          # Landing page
├── components/
│   ├── Navbar.tsx        # Navigation + wallet connect
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── hooks/
│   │   └── use-infopilot.ts  # Contract interaction hooks
│   ├── constants.ts      # Contract addresses, feeds, tokens
│   └── wagmi.ts          # Web3 config
└── contracts/
    └── abis.ts           # Smart contract ABIs
```

## 🌟 Features

### Dashboard (`/dashboard`)
- **Account Selection**: Choose from your created smart accounts or use demo account
- **Live Stats**: Active rule status, current price, sentiment, conditions
- **Portfolio View**: Token balances (WFLR, USDC, USDT)
- **Execution History**: Track all automated swaps

### Rules Page (`/rules`)
- **Multi-step Form**: Configure price threshold, sentiment, swap percentage
- **Quick Presets**: Bull Run Protection, Bear Market Shield, Sentiment Swing Trader
- **Feed Selection**: Choose from 8+ FTSO price feeds (BTC, ETH, XRP, etc.)
- **Token Pairs**: Customize swap direction (WFLR ↔ USDC ↔ USDT)

### Execute Page (`/execute`)
- **Manual Evaluation**: Trigger rule check on-demand
- **Live Console**: Step-by-step visualization of evaluation process
- **Condition Monitor**: Real-time price and sentiment checks
- **Dramatic UX**: Animated execution flow

### Feeds Page (`/feeds`)
- **Live Data**: Real-time FTSO prices (3s polling)
- **Sentiment Analysis**: FDC sentiment data (5s polling)
- **All Assets**: BTC, ETH, XRP, ADA, DOGE, SOL, FLR, SGB

## 🔧 Tech Stack

- **Framework**: Next.js 16.0.7 + React 19.2.0
- **Web3**: Wagmi v2 + Viem v2 + RainbowKit v2
- **Styling**: TailwindCSS v4 + shadcn/ui
- **Animation**: GSAP
- **Network**: Flare Coston2 Testnet

## 🎨 Design System

**Neobrutalism** design with:
- Bold 4px borders
- Dramatic shadows: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
- Primary colors:
  - Teal: `#00C7B7`
  - Yellow: `#FFD447`
  - Pink: `#FF6B9D`
  - Black: `#000000`

## 📝 Smart Contract Integration

### Factory Contract
```typescript
CONTRACTS.factory = "0x4B21438ffff00A0C78BdE1cdb96EBc5449C2edeE"
```

**Functions Used**:
- `createAccount()` - Deploy new smart account
- `getUserAccounts(address)` - Get user's accounts
- `getCurrentPrice(bytes32)` - Get FTSO price

### Smart Account Contract
```typescript
// Each user can create multiple smart accounts
```

**Functions Used**:
- `setRule()` - Configure trading rule
- `evaluate()` - Check & execute rule
- `currentRule()` - View active rule
- `getCurrentSentiment()` - Get FDC sentiment
- `getTokenBalance()` - Check holdings
- `executionHistory()` - View past swaps

## 🪝 Custom Hooks

All contract interactions abstracted into hooks (`/lib/hooks/use-infopilot.ts`):

```typescript
// Factory hooks
useCreateAccount()
useGetUserAccounts(address)

// Smart Account hooks
useSetRule(accountAddress)
useEvaluate(accountAddress)
useCheckConditions(accountAddress)
useGetCurrentRule(accountAddress)
useSmartAccountData(accountAddress)  // Combined hook

// Data hooks
useGetCurrentPrice(feedName)
useGetCurrentSentiment(symbol)
```

## 🌐 Demo Account

For users without created accounts, automatically fallback to:

```typescript
CONTRACTS.demoAccount = "0x0000000000000000000000000000000000000000"
```

Allows exploring UI without wallet transactions.

## 🔥 Available Feeds

| Asset | Feed Name | Symbol |
|-------|-----------|--------|
| Bitcoin | `BTC/USD` | BTC |
| Ethereum | `ETH/USD` | ETH |
| XRP | `XRP/USD` | XRP |
| Cardano | `ADA/USD` | ADA |
| Dogecoin | `DOGE/USD` | DOGE |
| Solana | `SOL/USD` | SOL |
| Flare | `FLR/USD` | FLR |
| Songbird | `SGB/USD` | SGB |

## 🎯 Rule Presets

### 1. Bull Run Protection
- **Trigger**: BTC > $100k
- **Sentiment**: Positive
- **Action**: Swap 50% WFLR → USDC

### 2. Bear Market Shield
- **Trigger**: BTC < $80k
- **Sentiment**: Negative
- **Action**: Swap 75% WFLR → USDC

### 3. Sentiment Swing Trader
- **Trigger**: ETH > $3.5k
- **Sentiment**: Any
- **Action**: Swap 30% USDC → WFLR

## 🚢 Deployment

```bash
# Build production bundle
pnpm build

# Start production server
pnpm start
```

## 📦 Environment

No `.env` needed - all config in `lib/constants.ts`:
- Hardcoded Coston2 RPC
- Deployed contract addresses
- Token addresses

## 🎨 Components

### UI Components (shadcn/ui)
40+ components installed:
- Forms: Input, Select, RadioGroup, Slider, Checkbox
- Layout: Card, Tabs, Separator, Sheet, Dialog
- Feedback: Toast, Badge, Spinner, Alert
- Navigation: Navbar, Breadcrumb, Pagination

### Custom Components
- `<Navbar>` - RainbowKit wallet + account selector
- `<Web3Providers>` - Wagmi + RainbowKit + React Query wrapper

## 🧪 Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Type check
pnpm build

# Lint
pnpm lint
```

## 🌍 Network Details

**Flare Coston2 Testnet**
- Chain ID: `114`
- RPC: `https://coston2.enosys.global/ext/C/rpc`
- Explorer: `https://coston2.testnet.flarescan.com`
- Currency: C2FLR (testnet token)

## 💡 Key Features

1. **Wallet Integration**: RainbowKit with MetaMask, WalletConnect, Coinbase
2. **Multi-Account**: Users can create multiple smart accounts
3. **Live Data**: Real-time FTSO prices & FDC sentiment
4. **Responsive**: Mobile-first design
5. **Type-Safe**: Full TypeScript with wagmi v2
6. **Animated**: GSAP-powered transitions

## 🔮 Future Enhancements

- WebSocket for real-time updates (replace polling)
- Recharts price history charts
- More complex rule logic (multi-condition)
- Automated execution monitoring
- Portfolio analytics
- Gas optimization dashboard

## 📖 Documentation

- [Flare Docs](https://docs.flare.network/)
- [FTSO Documentation](https://docs.flare.network/tech/ftso/)
- [FDC Documentation](https://docs.flare.network/tech/flare-data-connector/)
- [Wagmi Docs](https://wagmi.sh/)
- [RainbowKit Docs](https://www.rainbowkit.com/)

---

Built with ❤️ for Flare Hackathon
