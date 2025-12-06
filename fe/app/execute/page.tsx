"use client";

/**
 * Execute Page - Manual Rule Evaluation
 * Demonstrates rule checking and execution with dramatic animations
 */

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useGetUserAccounts,
  useGetCurrentPrice,
  useGetCurrentSentiment,
  useCheckConditions,
  useEvaluate,
  useSmartAccountData,
} from "@/lib/hooks/use-infopilot";
import { AVAILABLE_FEEDS, SENTIMENT_OPTIONS, weiToPrice, CONTRACTS } from "@/lib/constants";
import {
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export default function ExecutePage() {
  const { address, isConnected } = useAccount();
  const { data: userAccounts } = useGetUserAccounts(address);

  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationStep, setEvaluationStep] = useState(0);

  // Set default account
  useEffect(() => {
    if (!selectedAccount && userAccounts && userAccounts.length > 0) {
      setSelectedAccount(userAccounts[0] as string);
    } else if (!selectedAccount) {
      setSelectedAccount(CONTRACTS.demoAccount);
    }
  }, [userAccounts, selectedAccount]);

  // Fetch account data
  const { accountData } = useSmartAccountData(
    selectedAccount as `0x${string}` | undefined
  );

  const feedInfo = accountData?.ruleFeedName
    ? Object.values(AVAILABLE_FEEDS).find(
        (f) => f.name === accountData.ruleFeedName
      )
    : null;

  const { data: currentPrice, refetch: refetchPrice } = useGetCurrentPrice(
    feedInfo?.name || ""
  );

  const { data: currentSentiment, refetch: refetchSentiment } =
    useGetCurrentSentiment(feedInfo?.symbol || "");

  const { data: conditionsMet, refetch: refetchConditions } =
    useCheckConditions(selectedAccount as `0x${string}` | undefined);

  const { evaluate, isPending, isSuccess, hash } = useEvaluate(
    selectedAccount as `0x${string}` | undefined
  );

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Evaluation Complete!", {
        description: `Transaction: ${hash?.slice(0, 10)}...`,
      });
      setIsEvaluating(false);
      setEvaluationStep(0);
    }
  }, [isSuccess, hash]);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    setEvaluationStep(1);

    // Step 1: Check current price
    await refetchPrice();
    await new Promise((r) => setTimeout(r, 1000));
    setEvaluationStep(2);

    // Step 2: Check sentiment
    await refetchSentiment();
    await new Promise((r) => setTimeout(r, 1000));
    setEvaluationStep(3);

    // Step 3: Check conditions
    await refetchConditions();
    await new Promise((r) => setTimeout(r, 1000));
    setEvaluationStep(4);

    // Step 4: Execute
    evaluate();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="mx-auto max-w-md rounded-2xl border-4 border-black">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>
                Connect your wallet to execute rules
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!accountData?.ruleFeedName) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="mx-auto max-w-md rounded-2xl border-4 border-black">
            <CardHeader>
              <CardTitle>No Active Rule</CardTitle>
              <CardDescription>
                Create a trading rule first on the Rules page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => (window.location.href = "/rules")}
                className="w-full rounded-xl border-4 border-black bg-[#00C7B7] font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Go to Rules
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const priceThreshold = accountData.rulePriceThreshold
    ? parseFloat(weiToPrice(accountData.rulePriceThreshold))
    : 0;
  const currentPriceNum = typeof currentPrice === 'bigint' ? parseFloat(weiToPrice(currentPrice)) : 0;

  const sentimentLabel =
    SENTIMENT_OPTIONS.find((s) => s.value === accountData.ruleSentimentCondition)
      ?.label || "Any";

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Execute Rule</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manual evaluation and execution of your trading rule
          </p>
        </div>

        {/* Current Rule Summary */}
        <Card className="mb-6 rounded-2xl border-4 border-black">
          <CardHeader>
            <CardTitle>Active Rule Configuration</CardTitle>
            <CardDescription>Current rule parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Price Feed:</span>
              <Badge className="rounded-lg border-2 border-black bg-white text-black">
                {feedInfo?.displayName || accountData.ruleFeedName}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Price Condition:</span>
              <span className="font-bold">
                {accountData.ruleIsPriceBelow ? "Below" : "Above"} ${priceThreshold.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Sentiment:</span>
              <span className="font-bold">{sentimentLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Swap Amount:</span>
              <span className="font-bold">
                {accountData.ruleSwapPercentage
                  ? Number(accountData.ruleSwapPercentage) / 100
                  : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Console */}
        <Card className="mb-6 rounded-2xl border-4 border-black bg-gradient-to-br from-black to-gray-900 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#00C7B7]" />
              Evaluation Console
            </CardTitle>
            <CardDescription className="text-gray-300">
              Live monitoring and execution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1: Price Check */}
            <div
              className={`rounded-xl border-2 p-4 transition-all ${
                evaluationStep >= 1
                  ? "border-[#00C7B7] bg-[#00C7B7]/10"
                  : "border-gray-700 bg-gray-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {evaluationStep >= 1 ? (
                    <CheckCircle2 className="h-5 w-5 text-[#00C7B7]" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
                  )}
                  <span className="font-semibold">Price Check</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {currentPriceNum > priceThreshold ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className="font-mono font-bold">
                      ${currentPriceNum.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Target: ${priceThreshold.toLocaleString()} {accountData.ruleIsPriceBelow ? "↓" : "↑"}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2: Sentiment Check */}
            <div
              className={`rounded-xl border-2 p-4 transition-all ${
                evaluationStep >= 2
                  ? "border-[#FFD447] bg-[#FFD447]/10"
                  : "border-gray-700 bg-gray-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {evaluationStep >= 2 ? (
                    <CheckCircle2 className="h-5 w-5 text-[#FFD447]" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
                  )}
                  <span className="font-semibold">Sentiment Check</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold">
                    {typeof currentSentiment === 'number'
                      ? SENTIMENT_OPTIONS.find((s) => s.value === currentSentiment)
                          ?.label
                      : "—"}
                  </span>
                  <br />
                  <span className="text-xs text-gray-400">
                    Required: {sentimentLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3: Conditions Met */}
            <div
              className={`rounded-xl border-2 p-4 transition-all ${
                evaluationStep >= 3
                  ? conditionsMet
                    ? "border-green-400 bg-green-400/10"
                    : "border-red-400 bg-red-400/10"
                  : "border-gray-700 bg-gray-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {evaluationStep >= 3 ? (
                    conditionsMet ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
                  )}
                  <span className="font-semibold">Overall Conditions</span>
                </div>
                <span className="font-bold">
                  {evaluationStep >= 3
                    ? conditionsMet
                      ? "✅ Met"
                      : "❌ Not Met"
                    : "—"}
                </span>
              </div>
            </div>

            {/* Step 4: Execution */}
            <div
              className={`rounded-xl border-2 p-4 transition-all ${
                evaluationStep >= 4
                  ? "animate-pulse border-[#FF6B9D] bg-[#FF6B9D]/10"
                  : "border-gray-700 bg-gray-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isSuccess ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  ) : evaluationStep >= 4 ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FF6B9D] border-t-transparent" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
                  )}
                  <span className="font-semibold">Execute Swap</span>
                </div>
                <span className="font-bold">
                  {isSuccess
                    ? "✅ Complete"
                    : evaluationStep >= 4
                      ? "⏳ Processing..."
                      : "—"}
                </span>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Execute Button */}
            <Button
              onClick={handleEvaluate}
              disabled={isPending || isEvaluating}
              className="w-full gap-2 rounded-xl border-4 border-white bg-[#00C7B7] py-6 text-lg font-bold text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]"
            >
              {isPending || isEvaluating ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  Executing...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Execute Rule Now
                </>
              )}
            </Button>

            {conditionsMet !== true && evaluationStep >= 3 && (
              <div className="flex items-start gap-2 rounded-lg bg-yellow-500/10 p-3 text-yellow-300">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p className="text-sm">
                  Conditions not met. The swap will not execute, but you can still call
                  the function to verify on-chain.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="rounded-2xl border-4 border-black bg-blue-50">
          <CardContent className="flex gap-3 pt-6">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-black">How Execution Works</p>
              <p className="mt-1">
                The evaluate function checks if all conditions are met. If true, it
                automatically swaps tokens according to your rule. The evaluation happens
                on-chain, ensuring trustless execution.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
