"use client";

/**
 * Feeds Page - Live Price & Sentiment Data
 * Real-time monitoring of FTSO price feeds and FDC sentiment data
 */

import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetCurrentPrice, useGetCurrentSentiment } from "@/lib/hooks/use-infopilot";
import { AVAILABLE_FEEDS, SENTIMENT_OPTIONS, weiToPrice } from "@/lib/constants";
import { TrendingUp, TrendingDown, Activity, Brain } from "lucide-react";

function FeedCard({ feedKey, feed }: { feedKey: string; feed: typeof AVAILABLE_FEEDS[keyof typeof AVAILABLE_FEEDS] }) {
  const { data: price, isLoading: priceLoading } = useGetCurrentPrice(feed.name);
  const { data: sentiment, isLoading: sentimentLoading } = useGetCurrentSentiment(feed.symbol);

  const priceValue = typeof price === 'bigint' ? parseFloat(weiToPrice(price)) : 0;
  const sentimentLabel = typeof sentiment === 'number' ? SENTIMENT_OPTIONS.find((s) => s.value === sentiment)?.label : undefined;
  const sentimentEmoji = sentimentLabel ? sentimentLabel.split(' ')[1] : undefined;

  return (
    <Card className="rounded-2xl border-4 border-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{feed.displayName}</CardTitle>
            <CardDescription className="mt-1 font-mono text-xs">
              {feed.name}
            </CardDescription>
          </div>
          <Badge className="rounded-lg border-2 border-black bg-[#00C7B7] text-black">
            {feed.symbol}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Section */}
        <div className="rounded-xl border-4 border-black bg-gradient-to-br from-[#00C7B7]/10 to-[#00C7B7]/5 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-gray-600">
            <Activity className="h-4 w-4" />
            <span>FTSO Price Feed</span>
          </div>
          {priceLoading ? (
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-black">
                ${priceValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Real-time price from Flare Time Series Oracle
          </p>
        </div>

        {/* Sentiment Section */}
        <div className="rounded-xl border-4 border-black bg-gradient-to-br from-[#FFD447]/10 to-[#FFD447]/5 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm text-gray-600">
            <Brain className="h-4 w-4" />
            <span>FDC Sentiment Analysis</span>
          </div>
          {sentimentLoading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{sentimentEmoji}</span>
              <span className="text-2xl font-bold text-black">
                {sentimentLabel || "Unknown"}
              </span>
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Market sentiment from Flare Data Connector
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FeedsPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Live Data Feeds</h1>
          <p className="mt-2 text-lg text-gray-600">
            Real-time price and sentiment data from Flare Network
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 rounded-2xl border-4 border-black bg-gradient-to-r from-[#00C7B7] to-[#FFD447]">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-black bg-white">
              <Activity className="h-6 w-6 text-black" />
            </div>
            <div>
              <p className="font-bold text-black">
                Powered by Flare Network's Native Oracles
              </p>
              <p className="text-sm text-black/80">
                FTSO provides decentralized price feeds • FDC delivers off-chain sentiment data
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Feed Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(AVAILABLE_FEEDS).map(([key, feed]) => (
            <FeedCard key={key} feedKey={key} feed={feed} />
          ))}
        </div>

        {/* Legend */}
        <Card className="mt-8 rounded-2xl border-4 border-black">
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <Badge className="rounded-lg border-2 border-black bg-[#00C7B7] text-black">
                FTSO
              </Badge>
              <div>
                <p className="font-semibold">Flare Time Series Oracle</p>
                <p className="text-sm text-gray-600">
                  Decentralized price oracle providing continuous price updates for crypto assets
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge className="rounded-lg border-2 border-black bg-[#FFD447] text-black">
                FDC
              </Badge>
              <div>
                <p className="font-semibold">Flare Data Connector</p>
                <p className="text-sm text-gray-600">
                  Verifies and delivers off-chain data including sentiment analysis from external sources
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
