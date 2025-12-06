/**
 * InfoPilot Constants
 * Contract addresses, feed configurations, and network settings
 */

import { type Address } from "viem";

// ========================================
// DEPLOYED CONTRACT ADDRESSES (COSTON2)
// ========================================

export const CONTRACTS = {
  factory: "0x72c57B68c5fd7325D0264F9689F4bbF8D4469385" as Address,
  demoAccount: "0xb44b2795C3ab0157cE493EA0D12ac384a0b15F65" as Address,
  sentimentOracle: "0xe5F14d35aDA94b11E56E588de76E6704c5D13178" as Address,
  dex: "0x03b5560f67Ce8b698C3CDbC043C8e1f89197731b" as Address,
  wflr: "0x35984E84E8cd592F9e162e58E559A46cecBE13DA" as Address,
  usdc: "0x64E2Bce63A968Bfdc52372B869831212B5505bb5" as Address,
  usdt: "0x18Dc78cFbBEbBE911dB1e22Cb12291Ae7Ace92Ba" as Address,
  ftsoV2: "0x7BDE3Df0624114eDB3A67dFe6753e62f4e7c1d20" as Address,
  feedConverter: "0xafEa60cabb2daB413D17b85Db82cCf6EB06a0F66" as Address,
} as const;

// ========================================
// NETWORK CONFIGURATION
// ========================================

export const COSTON2_NETWORK = {
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
} as const;

// ========================================
// FEED CONFIGURATIONS
// ========================================

export type FeedCategory = 1 | 2 | 3 | 4;

export interface FeedConfig {
  name: string;
  displayName: string;
  symbol: string;
  category: FeedCategory; // 1=crypto, 2=FX, 3=commodity, 4=stock
  description: string;
}

export const AVAILABLE_FEEDS: Record<string, FeedConfig> = {
  "BTC/USD": {
    name: "BTC/USD",
    displayName: "Bitcoin",
    symbol: "BTC",
    category: 1,
    description: "Bitcoin to US Dollar",
  },
  "ETH/USD": {
    name: "ETH/USD",
    displayName: "Ethereum",
    symbol: "ETH",
    category: 1,
    description: "Ethereum to US Dollar",
  },
  "FLR/USD": {
    name: "FLR/USD",
    displayName: "Flare",
    symbol: "FLR",
    category: 1,
    description: "Flare to US Dollar",
  },
  "XRP/USD": {
    name: "XRP/USD",
    displayName: "XRP",
    symbol: "XRP",
    category: 1,
    description: "XRP to US Dollar",
  },
  "DOGE/USD": {
    name: "DOGE/USD",
    displayName: "Dogecoin",
    symbol: "DOGE",
    category: 1,
    description: "Dogecoin to US Dollar",
  },
  "ADA/USD": {
    name: "ADA/USD",
    displayName: "Cardano",
    symbol: "ADA",
    category: 1,
    description: "Cardano to US Dollar",
  },
  "ALGO/USD": {
    name: "ALGO/USD",
    displayName: "Algorand",
    symbol: "ALGO",
    category: 1,
    description: "Algorand to US Dollar",
  },
  "LTC/USD": {
    name: "LTC/USD",
    displayName: "Litecoin",
    symbol: "LTC",
    category: 1,
    description: "Litecoin to US Dollar",
  },
} as const;

// ========================================
// TOKEN CONFIGURATIONS
// ========================================

export interface TokenConfig {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  isNative?: boolean;
}

export const TOKENS: Record<string, TokenConfig> = {
  WFLR: {
    address: CONTRACTS.wflr,
    symbol: "WFLR",
    name: "Wrapped Flare",
    decimals: 18,
  },
  USDC: {
    address: CONTRACTS.usdc,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 18, // Mock token on testnet
  },
  USDT: {
    address: CONTRACTS.usdt,
    symbol: "USDT",
    name: "Tether USD",
    decimals: 18, // Mock token on testnet
  },
  C2FLR: {
    address: "0x0000000000000000000000000000000000000000" as Address,
    symbol: "C2FLR",
    name: "Coston2 Flare",
    decimals: 18,
    isNative: true,
  },
} as const;

// ========================================
// SENTIMENT CONFIGURATIONS
// ========================================

export const SENTIMENT_OPTIONS = [
  { value: -1, label: "Negative 📉", color: "#FF6B6B", description: "Bearish market sentiment" },
  { value: 0, label: "Neutral 📊", color: "#FFD447", description: "Neutral market sentiment" },
  { value: 1, label: "Positive 📈", color: "#00C7B7", description: "Bullish market sentiment" },
] as const;

// ========================================
// RULE PRESETS (FOR DEMOS)
// ========================================

export interface RulePreset {
  name: string;
  description: string;
  feedName: string;
  assetSymbol: string;
  priceThreshold: string; // In human-readable format (e.g., "90000")
  isPriceBelow: boolean;
  sentimentCondition: -1 | 0 | 1;
  swapPercentage: number; // 0-100
  tokenIn: Address;
  tokenOut: Address;
}

export const RULE_PRESETS: RulePreset[] = [
  {
    name: "BTC Bear Protection",
    description: "Swap 50% to USDC if BTC drops below $90k with negative sentiment",
    feedName: "BTC/USD",
    assetSymbol: "BTC",
    priceThreshold: "90000",
    isPriceBelow: true,
    sentimentCondition: -1,
    swapPercentage: 50,
    tokenIn: CONTRACTS.wflr,
    tokenOut: CONTRACTS.usdc,
  },
  {
    name: "ETH Bull Entry",
    description: "Swap 30% to WFLR if ETH rises above $3500 with positive sentiment",
    feedName: "ETH/USD",
    assetSymbol: "ETH",
    priceThreshold: "3500",
    isPriceBelow: false,
    sentimentCondition: 1,
    swapPercentage: 30,
    tokenIn: CONTRACTS.usdc,
    tokenOut: CONTRACTS.wflr,
  },
  {
    name: "FLR Neutral Rebalance",
    description: "Swap 25% on neutral sentiment when FLR hits $0.02",
    feedName: "FLR/USD",
    assetSymbol: "FLR",
    priceThreshold: "0.02",
    isPriceBelow: false,
    sentimentCondition: 0,
    swapPercentage: 25,
    tokenIn: CONTRACTS.wflr,
    tokenOut: CONTRACTS.usdt,
  },
] as const;

// ========================================
// UI CONSTANTS
// ========================================

export const COLORS = {
  primary: "#00C7B7",
  accent: "#FFD447",
  danger: "#FF6B6B",
  background: "#F5F7FA",
  text: "#111111",
  border: "#111111",
} as const;

export const POLLING_INTERVAL = {
  PRICE: 3000, // 3 seconds
  SENTIMENT: 5000, // 5 seconds
  BALANCE: 10000, // 10 seconds
  EXECUTION_HISTORY: 15000, // 15 seconds
} as const;

// ========================================
// CONVERSION UTILITIES
// ========================================

/**
 * Convert human-readable price to wei (18 decimals)
 * @param price Price as string (e.g., "90000")
 * @returns BigInt in wei
 */
export function priceToWei(price: string): bigint {
  const num = parseFloat(price);
  return BigInt(Math.floor(num * 1e18));
}

/**
 * Convert wei to human-readable price
 * @param wei Price in wei
 * @returns Formatted price string
 */
export function weiToPrice(wei: bigint): string {
  return (Number(wei) / 1e18).toFixed(2);
}

/**
 * Convert percentage (0-100) to basis points (0-10000)
 * @param percentage Percentage 0-100
 * @returns Basis points (10000 = 100%)
 */
export function percentageToBasisPoints(percentage: number): number {
  return Math.floor(percentage * 100);
}

/**
 * Convert basis points to percentage
 * @param basisPoints Basis points (10000 = 100%)
 * @returns Percentage 0-100
 */
export function basisPointsToPercentage(basisPoints: number): number {
  return basisPoints / 100;
}
