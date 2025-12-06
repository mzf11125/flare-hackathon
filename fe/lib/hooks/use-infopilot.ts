/**
 * InfoPilot Contract Hooks
 * Wagmi-based hooks for interacting with InfoPilot smart contracts
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAccount } from "wagmi";
import type { Address } from "viem";
import { infoPilotFactoryAbi, infoPilotSmartAccountAbi, erc20Abi } from "@/contracts/abis";
import { CONTRACTS } from "@/lib/constants";

// ========================================
// FACTORY HOOKS
// ========================================

/**
 * Get user's smart accounts from factory
 */
export function useGetUserAccounts(userAddress?: Address) {
  return useReadContract({
    address: CONTRACTS.factory,
    abi: infoPilotFactoryAbi,
    functionName: "getUserAccounts",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      retry: 3,
      staleTime: 10000,
    },
  });
}

/**
 * Get user's account count
 */
export function useGetUserAccountCount(userAddress?: Address) {
  return useReadContract({
    address: CONTRACTS.factory,
    abi: infoPilotFactoryAbi,
    functionName: "getUserAccountCount",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });
}

/**
 * Create a new smart account
 */
export function useCreateAccount() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createAccount = () => {
    writeContract({
      address: CONTRACTS.factory,
      abi: infoPilotFactoryAbi,
      functionName: "createAccount",
    });
  };

  return {
    createAccount,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// ========================================
// SMART ACCOUNT HOOKS
// ========================================

/**
 * Get current rule from smart account
 */
export function useGetCurrentRule(accountAddress?: Address) {
  return useReadContract({
    address: accountAddress,
    abi: infoPilotSmartAccountAbi,
    functionName: "currentRule",
    query: {
      enabled: !!accountAddress,
      refetchInterval: 5000, // Refresh every 5 seconds
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  });
}

/**
 * Set a trading rule
 */
export function useSetRule(accountAddress?: Address) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const setRule = (params: {
    feedName: string;
    assetSymbol: string;
    priceThreshold: bigint;
    isPriceBelow: boolean;
    sentimentCondition: number;
    swapPercentage: bigint;
    tokenIn: Address;
    tokenOut: Address;
  }) => {
    if (!accountAddress) return;

    writeContract({
      address: accountAddress,
      abi: infoPilotSmartAccountAbi,
      functionName: "setRule",
      args: [
        params.feedName,
        params.assetSymbol,
        params.priceThreshold,
        params.isPriceBelow,
        params.sentimentCondition,
        params.swapPercentage,
        params.tokenIn,
        params.tokenOut,
      ],
    });
  };

  return {
    setRule,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Evaluate rule and execute if conditions met
 */
export function useEvaluate(accountAddress?: Address) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const evaluate = () => {
    if (!accountAddress) return;

    writeContract({
      address: accountAddress,
      abi: infoPilotSmartAccountAbi,
      functionName: "evaluate",
    });
  };

  return {
    evaluate,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Check if conditions are met (simplified for demo)
 * Returns true if account has a rule set
 */
export function useCheckConditions(accountAddress?: Address) {
  const { data: rule } = useReadContract({
    address: accountAddress,
    abi: infoPilotSmartAccountAbi,
    functionName: "currentRule",
    query: {
      enabled: !!accountAddress,
    },
  });
  
  return {
    data: rule ? true : false,
    isLoading: false,
    refetch: async () => {},
  };
}

/**
 * Get current price from FTSO (mock for demo)
 */
export function useGetCurrentPrice(feedName: string) {
  // For demo, return a mock price
  // In production, call factory.getCurrentPrice(bytes32 feedName)
  return {
    data: BigInt(90000 * 10**18), // Mock price
    isLoading: false,
    refetch: async () => {},
  };
}

/**
 * Get current sentiment
 */
export function useGetCurrentSentiment(symbol: string | Address | undefined) {
  return useReadContract({
    address: symbol && symbol.startsWith('0x') ? (symbol as Address) : undefined,
    abi: infoPilotSmartAccountAbi,
    functionName: "getCurrentSentiment",
    query: {
      enabled: !!(symbol && symbol.startsWith('0x')),
      refetchInterval: 5000, // Refresh every 5 seconds
      retry: 2,
    },
  });
}

/**
 * Get execution history count
 */
export function useGetExecutionCount(accountAddress?: Address) {
  return useReadContract({
    address: accountAddress,
    abi: infoPilotSmartAccountAbi,
    functionName: "getExecutionCount",
    query: {
      enabled: !!accountAddress,
      refetchInterval: 10000,
    },
  });
}

/**
 * Get specific execution from history
 */
export function useGetExecution(accountAddress?: Address, index?: number) {
  return useReadContract({
    address: accountAddress,
    abi: infoPilotSmartAccountAbi,
    functionName: "executionHistory",
    args: index !== undefined ? [BigInt(index)] : undefined,
    query: {
      enabled: !!accountAddress && index !== undefined,
    },
  });
}

/**
 * Get token balance
 */
export function useGetTokenBalance(accountAddress?: Address, tokenAddress?: Address) {
  return useReadContract({
    address: accountAddress,
    abi: infoPilotSmartAccountAbi,
    functionName: "getTokenBalance",
    args: tokenAddress ? [tokenAddress] : undefined,
    query: {
      enabled: !!accountAddress && !!tokenAddress,
      refetchInterval: 10000,
    },
  });
}

/**
 * Deactivate current rule
 */
export function useDeactivateRule(accountAddress?: Address) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const deactivateRule = () => {
    if (!accountAddress) return;

    writeContract({
      address: accountAddress,
      abi: infoPilotSmartAccountAbi,
      functionName: "deactivateRule",
    });
  };

  return {
    deactivateRule,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Get account owner
 */
export function useGetOwner(accountAddress?: Address) {
  return useReadContract({
    address: accountAddress,
    abi: infoPilotSmartAccountAbi,
    functionName: "owner",
    query: {
      enabled: !!accountAddress,
    },
  });
}

// ========================================
// ERC20 TOKEN HOOKS
// ========================================

/**
 * Get ERC20 token balance
 */
export function useTokenBalance(tokenAddress?: Address, holderAddress?: Address) {
  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: holderAddress ? [holderAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!holderAddress,
      refetchInterval: 10000,
    },
  });
}

/**
 * Get token symbol
 */
export function useTokenSymbol(tokenAddress?: Address) {
  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "symbol",
    query: {
      enabled: !!tokenAddress,
    },
  });
}

/**
 * Transfer tokens to smart account
 */
export function useTransferToken(tokenAddress?: Address) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const transfer = (to: Address, amount: bigint) => {
    if (!tokenAddress) return;

    writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "transfer",
      args: [to, amount],
    });
  };

  return {
    transfer,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// ========================================
// COMBINED HOOKS
// ========================================

/**
 * Get all data for a smart account (rule, balances, history)
 */
export function useSmartAccountData(accountAddress?: Address) {
  const { address: userAddress } = useAccount();
  
  const rule = useGetCurrentRule(accountAddress);
  const price = useGetCurrentPrice("");
  const sentiment = useGetCurrentSentiment(accountAddress);
  const conditions = useCheckConditions(accountAddress);
  const executionCount = useGetExecutionCount(accountAddress);
  const owner = useGetOwner(accountAddress);
  
  // Token balances
  const wflrBalance = useGetTokenBalance(accountAddress, CONTRACTS.wflr);
  const usdcBalance = useGetTokenBalance(accountAddress, CONTRACTS.usdc);
  const usdtBalance = useGetTokenBalance(accountAddress, CONTRACTS.usdt);
  
  // Extract rule data from tuple
  // ABI order: [priceFeedId, assetSymbol, priceThreshold, isPriceBelow, sentimentCondition, swapPercentage, tokenIn, tokenOut, active, createdAt]
  const ruleData = rule.data as readonly [
    `0x${string}`,  // priceFeedId (bytes21)
    string,         // assetSymbol
    bigint,         // priceThreshold
    boolean,        // isPriceBelow
    number,         // sentimentCondition
    bigint,         // swapPercentage
    `0x${string}`,  // tokenIn
    `0x${string}`,  // tokenOut
    boolean,        // active
    bigint          // createdAt
  ] | undefined;
  
  return {
    rule: rule.data,
    accountData: ruleData ? {
      rulePriceFeedId: ruleData[0],
      ruleAssetSymbol: ruleData[1],
      rulePriceThreshold: ruleData[2],
      ruleIsPriceBelow: ruleData[3],
      ruleSentimentCondition: ruleData[4],
      ruleSwapPercentage: ruleData[5],
      ruleTokenIn: ruleData[6],
      ruleTokenOut: ruleData[7],
      ruleIsActive: ruleData[8],
      ruleCreatedAt: ruleData[9],
    } : undefined,
    price: price.data,
    sentiment: sentiment.data,
    conditions: conditions.data,
    executionCount: executionCount.data,
    owner: owner.data,
    balances: {
      wflr: wflrBalance.data,
      usdc: usdcBalance.data,
      usdt: usdtBalance.data,
    },
    isLoading:
      rule.isLoading ||
      price.isLoading ||
      sentiment.isLoading,
    error: rule.error || sentiment.error,
  };
}
