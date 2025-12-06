"use client";

/**
 * Dashboard Page
 * Shows portfolio overview, active rules, live feeds, execution history
 */

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetUserAccounts,
  useCreateAccount,
  useSmartAccountData,
} from "@/lib/hooks/use-infopilot";
import { CONTRACTS, weiToPrice, basisPointsToPercentage, SENTIMENT_OPTIONS } from "@/lib/constants";
import { Rocket, TrendingUp, Activity, Clock, AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { data: userAccounts, isLoading: accountsLoading } = useGetUserAccounts(address);
  const { createAccount, isPending, isSuccess } = useCreateAccount();
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  // Use demo account if no accounts exist
  useEffect(() => {
    if (!selectedAccount && userAccounts && userAccounts.length > 0) {
      setSelectedAccount(userAccounts[0] as string);
    } else if (!selectedAccount && !accountsLoading) {
      setSelectedAccount(CONTRACTS.demoAccount);
    }
  }, [userAccounts, accountsLoading, selectedAccount]);

  const accountData = useSmartAccountData(
    selectedAccount as `0x${string}` | undefined
  );

  // Handle account creation success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Smart Account Created!", {
        description: "Your new InfoPilot account is ready to use.",
      });
    }
  }, [isSuccess]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="mx-auto max-w-md rounded-2xl border-4 border-black">
            <CardHeader>
              <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
              <CardDescription>
                Connect your wallet to access the InfoPilot dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Rocket className="h-24 w-24 text-[#00C7B7]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const hasAccounts = userAccounts && userAccounts.length > 0;
  const rule = accountData.rule;
  const price = accountData.price;
  const sentiment = accountData.sentiment;
  const conditions = accountData.conditions;

  const sentimentOption = SENTIMENT_OPTIONS.find(
    (opt) => opt.value === sentiment?.[0]
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black">Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your autonomous trading agents
            </p>
          </div>

          {!hasAccounts && (
            <Button
              onClick={() => createAccount()}
              disabled={isPending}
              className="gap-2 rounded-xl border-4 border-black bg-[#00C7B7] px-6 py-3 text-lg font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <Plus className="h-5 w-5" />
              {isPending ? "Creating..." : "Create Account"}
            </Button>
          )}
        </div>

        {/* Demo Account Banner */}
        {selectedAccount === CONTRACTS.demoAccount && (
          <Card className="mb-6 rounded-2xl border-4 border-[#FFD447] bg-[#FFD447]/20">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-[#FFD447]" />
              <div>
                <p className="font-bold text-black">Viewing Demo Account</p>
                <p className="text-sm text-gray-700">
                  Explore InfoPilot features with our pre-configured demo account
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl border-4 border-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Rule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rule?.[8] ? "Yes" : "No"}
              </div>
              <Badge
                variant={rule?.[8] ? "default" : "secondary"}
                className="mt-2"
              >
                {rule?.[8] ? "Active" : "Inactive"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-4 border-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Current Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof price === 'bigint' ? `$${weiToPrice(price)}` : "—"}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {rule?.[1] || "No asset selected"}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-4 border-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sentimentOption?.label || "—"}
              </div>
              <p className="mt-2 text-xs text-gray-500">Market mood</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-4 border-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Conditions Met
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conditions === true ? "Ready ✓" : "Waiting"}
              </div>
              <Badge
                variant={conditions === true ? "default" : "secondary"}
                className="mt-2"
              >
                {conditions === true ? "Execute Now" : "Monitoring"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="rule" className="space-y-6">
          <TabsList className="rounded-xl border-4 border-black bg-white p-1">
            <TabsTrigger
              value="rule"
              className="rounded-lg data-[state=active]:bg-[#00C7B7]"
            >
              <Activity className="mr-2 h-4 w-4" />
              Current Rule
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="rounded-lg data-[state=active]:bg-[#00C7B7]"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-lg data-[state=active]:bg-[#00C7B7]"
            >
              <Clock className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Current Rule Tab */}
          <TabsContent value="rule" className="space-y-4">
            <Card className="rounded-2xl border-4 border-black">
              <CardHeader>
                <CardTitle>Active Trading Rule</CardTitle>
                <CardDescription>
                  Automated execution based on price + sentiment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rule?.[8] ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Asset</p>
                        <p className="text-lg font-bold">{rule[1]}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Price Threshold
                        </p>
                        <p className="text-lg font-bold">
                          ${weiToPrice(rule[2])} ({rule[3] ? "below" : "above"})
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Sentiment Condition
                        </p>
                        <p className="text-lg font-bold">
                          {SENTIMENT_OPTIONS.find((opt) => opt.value === rule[4])
                            ?.label || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Swap Amount
                        </p>
                        <p className="text-lg font-bold">
                          {basisPointsToPercentage(Number(rule[5]))}% of balance
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href="/execute" className="flex-1">
                        <Button className="w-full rounded-xl border-4 border-black bg-[#00C7B7] font-bold">
                          Evaluate Now
                        </Button>
                      </Link>
                      <Link href="/rules" className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full rounded-xl border-4 border-black font-bold"
                        >
                          Edit Rule
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Rocket className="mx-auto h-16 w-16 text-gray-400" />
                    <p className="mt-4 text-lg font-medium text-gray-600">
                      No active rule
                    </p>
                    <Link href="/rules">
                      <Button className="mt-4 rounded-xl border-4 border-black bg-[#FFD447] font-bold">
                        Create Rule
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card className="rounded-2xl border-4 border-black">
              <CardHeader>
                <CardTitle>Token Balances</CardTitle>
                <CardDescription>
                  Assets in your smart account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border-2 border-gray-300 p-4">
                    <div>
                      <p className="font-bold">WFLR</p>
                      <p className="text-sm text-gray-500">Wrapped Flare</p>
                    </div>
                    <p className="text-xl font-bold">
                      {accountData.balances.wflr
                        ? (Number(accountData.balances.wflr) / 1e18).toFixed(4)
                        : "0.0000"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border-2 border-gray-300 p-4">
                    <div>
                      <p className="font-bold">USDC</p>
                      <p className="text-sm text-gray-500">USD Coin</p>
                    </div>
                    <p className="text-xl font-bold">
                      {accountData.balances.usdc
                        ? (Number(accountData.balances.usdc) / 1e18).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border-2 border-gray-300 p-4">
                    <div>
                      <p className="font-bold">USDT</p>
                      <p className="text-sm text-gray-500">Tether USD</p>
                    </div>
                    <p className="text-xl font-bold">
                      {accountData.balances.usdt
                        ? (Number(accountData.balances.usdt) / 1e18).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="rounded-2xl border-4 border-black">
              <CardHeader>
                <CardTitle>Execution History</CardTitle>
                <CardDescription>
                  Past automated trades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center">
                  <Clock className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-lg font-medium text-gray-600">
                    No executions yet
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Trades will appear here when your rule triggers
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
