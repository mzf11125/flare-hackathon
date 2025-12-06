/**
 * Wagmi + RainbowKit Configuration
 * Sets up Web3 providers for Flare Coston2 network
 */

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

// Define Coston2 chain
export const coston2 = defineChain({
  id: 114,
  name: "Flare Testnet Coston2",
  network: "coston2",
  nativeCurrency: {
    decimals: 18,
    name: "Coston2 Flare",
    symbol: "C2FLR",
  },
  rpcUrls: {
    default: {
      http: ["https://coston2.enosys.global/ext/C/rpc"],
      webSocket: ["wss://coston2.enosys.global/ext/C/ws"],
    },
    public: {
      http: ["https://coston2-api.flare.network/ext/C/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Coston2 Explorer",
      url: "https://coston2-explorer.flare.network",
    },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: "InfoPilot - Autonomous Information Finance Agent",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [coston2],
  ssr: true, // Enable SSR for Next.js
});
