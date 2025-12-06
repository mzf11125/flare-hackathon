"use client";

/**
 * Rules Page - Create Trading Rules
 * Multi-step form for setting up automated trading conditions
 */

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useSetRule, useGetUserAccounts } from "@/lib/hooks/use-infopilot";
import {
  AVAILABLE_FEEDS,
  TOKENS,
  SENTIMENT_OPTIONS,
  RULE_PRESETS,
  priceToWei,
  percentageToBasisPoints,
  CONTRACTS,
} from "@/lib/constants";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import type { Address } from "viem";

export default function RulesPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data: userAccounts } = useGetUserAccounts(address);
  
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const { setRule, isPending, isSuccess } = useSetRule(
    selectedAccount as `0x${string}` | undefined
  );

  // Form state
  const [feedName, setFeedName] = useState("BTC/USD");
  const [priceThreshold, setPriceThreshold] = useState("90000");
  const [isPriceBelow, setIsPriceBelow] = useState(true);
  const [sentimentCondition, setSentimentCondition] = useState<number>(-1);
  const [swapPercentage, setSwapPercentage] = useState([50]);
  const [tokenIn, setTokenIn] = useState<string>(TOKENS.WFLR.address);
  const [tokenOut, setTokenOut] = useState<string>(TOKENS.USDC.address);

  // Set default account
  useEffect(() => {
    if (!selectedAccount && userAccounts && userAccounts.length > 0) {
      setSelectedAccount(userAccounts[0] as string);
    } else if (!selectedAccount) {
      setSelectedAccount(CONTRACTS.demoAccount);
    }
  }, [userAccounts, selectedAccount]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Rule Created!", {
        description: "Your trading rule is now active",
      });
      router.push("/dashboard");
    }
  }, [isSuccess, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const feed = AVAILABLE_FEEDS[feedName];
    if (!feed) {
      toast.error("Invalid feed selected");
      return;
    }

    setRule({
      feedName: feed.name,
      assetSymbol: feed.symbol,
      priceThreshold: priceToWei(priceThreshold),
      isPriceBelow,
      sentimentCondition,
      swapPercentage: BigInt(percentageToBasisPoints(swapPercentage[0])),
      tokenIn: tokenIn as Address,
      tokenOut: tokenOut as Address,
    });
  };

  const loadPreset = (preset: typeof RULE_PRESETS[0]) => {
    setFeedName(preset.feedName);
    setPriceThreshold(preset.priceThreshold);
    setIsPriceBelow(preset.isPriceBelow);
    setSentimentCondition(preset.sentimentCondition);
    setSwapPercentage([preset.swapPercentage]);
    setTokenIn(preset.tokenIn);
    setTokenOut(preset.tokenOut);
    toast.success(`Loaded preset: ${preset.name}`);
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
                Connect your wallet to create trading rules
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Create Trading Rule</h1>
          <p className="mt-2 text-lg text-gray-600">
            Set conditions for automated portfolio rebalancing
          </p>
        </div>

        {/* Quick Presets */}
        <Card className="mb-6 rounded-2xl border-4 border-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FFD447]" />
              Quick Presets
            </CardTitle>
            <CardDescription>Load a pre-configured rule template</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {RULE_PRESETS.map((preset) => (
              <Button
                key={preset.name}
                onClick={() => loadPreset(preset)}
                variant="outline"
                className="h-auto flex-col items-start rounded-xl border-4 border-black p-4 text-left"
              >
                <p className="font-bold text-black">{preset.name}</p>
                <p className="mt-1 text-xs text-gray-600">{preset.description}</p>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Rule Form */}
        <form onSubmit={handleSubmit}>
          <Card className="rounded-2xl border-4 border-black">
            <CardHeader>
              <CardTitle>Rule Configuration</CardTitle>
              <CardDescription>
                Define price and sentiment conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Feed Selection */}
              <div className="space-y-2">
                <Label htmlFor="feed">Price Feed</Label>
                <Select value={feedName} onValueChange={setFeedName}>
                  <SelectTrigger
                    id="feed"
                    className="rounded-xl border-4 border-black"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-4 border-black">
                    {Object.entries(AVAILABLE_FEEDS).map(([key, feed]) => (
                      <SelectItem key={key} value={key}>
                        {feed.displayName} ({feed.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Threshold */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price Threshold (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={priceThreshold}
                    onChange={(e) => setPriceThreshold(e.target.value)}
                    className="rounded-xl border-4 border-black"
                    placeholder="90000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Trigger When Price Is</Label>
                  <RadioGroup
                    value={isPriceBelow ? "below" : "above"}
                    onValueChange={(v) => setIsPriceBelow(v === "below")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="below" id="below" />
                      <Label htmlFor="below" className="cursor-pointer">
                        Below threshold 📉
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="above" id="above" />
                      <Label htmlFor="above" className="cursor-pointer">
                        Above threshold 📈
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Sentiment Condition */}
              <div className="space-y-2">
                <Label>Market Sentiment Condition</Label>
                <RadioGroup
                  value={sentimentCondition.toString()}
                  onValueChange={(v) => setSentimentCondition(parseInt(v))}
                >
                  {SENTIMENT_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option.value.toString()}
                        id={`sentiment-${option.value}`}
                      />
                      <Label
                        htmlFor={`sentiment-${option.value}`}
                        className="cursor-pointer"
                      >
                        {option.label} — {option.description}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Swap Percentage */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Swap Percentage</Label>
                  <span className="text-lg font-bold text-[#00C7B7]">
                    {swapPercentage[0]}%
                  </span>
                </div>
                <Slider
                  value={swapPercentage}
                  onValueChange={setSwapPercentage}
                  max={100}
                  step={5}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Swap {swapPercentage[0]}% of your balance when conditions are met
                </p>
              </div>

              {/* Token Selection */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tokenIn">Swap From</Label>
                  <Select value={tokenIn} onValueChange={setTokenIn}>
                    <SelectTrigger
                      id="tokenIn"
                      className="rounded-xl border-4 border-black"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-4 border-black">
                      {Object.entries(TOKENS)
                        .filter(([_, token]) => !token.isNative)
                        .map(([key, token]) => (
                          <SelectItem key={key} value={token.address}>
                            {token.symbol} — {token.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tokenOut">Swap To</Label>
                  <Select value={tokenOut} onValueChange={setTokenOut}>
                    <SelectTrigger
                      id="tokenOut"
                      className="rounded-xl border-4 border-black"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-4 border-black">
                      {Object.entries(TOKENS)
                        .filter(([_, token]) => !token.isNative)
                        .map(([key, token]) => (
                          <SelectItem key={key} value={token.address}>
                            {token.symbol} — {token.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full gap-2 rounded-xl border-4 border-black bg-[#00C7B7] py-6 text-lg font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  {isPending ? (
                    <>Creating Rule...</>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      Create Rule
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
