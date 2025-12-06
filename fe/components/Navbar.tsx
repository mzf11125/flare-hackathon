"use client";

/**
 * Navbar Component
 * Features: Wallet connection, network display, account selector, navigation
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUserAccounts } from "@/lib/hooks/use-infopilot";
import { CONTRACTS } from "@/lib/constants";
import { Rocket, LayoutDashboard, Sparkles, Activity, Zap } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { address } = useAccount();
  const { data: userAccounts } = useGetUserAccounts(address);
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  const navLinks = [
    { href: "/", label: "Home", icon: Rocket },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/rules", label: "Rules", icon: Sparkles },
    { href: "/feeds", label: "Feeds", icon: Activity },
    { href: "/execute", label: "Execute", icon: Zap },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b-4 border-black bg-[#F5F7FA]">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-2xl border-4 border-black bg-[#00C7B7] p-2">
              <Rocket className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-black">InfoPilot</span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className={`gap-2 rounded-xl border-2 ${
                      isActive
                        ? "border-black bg-[#FFD447] text-black"
                        : "border-transparent text-black hover:border-black hover:bg-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right Section: Account Selector + Wallet */}
          <div className="flex items-center gap-3">
            {/* Smart Account Selector */}
            {address && userAccounts && userAccounts.length > 0 && (
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="w-[180px] rounded-xl border-4 border-black bg-white text-black">
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-4 border-black">
                  {/* Demo Account Option */}
                  <SelectItem
                    value="demo"
                    className="rounded-lg font-mono text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#FFD447]">★</span>
                      <span>Demo Account</span>
                    </div>
                  </SelectItem>
                  
                  {/* User's Accounts */}
                  {userAccounts.map((account, index) => (
                    <SelectItem
                      key={account}
                      value={account}
                      className="rounded-lg font-mono text-sm"
                    >
                      Account #{index + 1} ({account.slice(0, 6)}...
                      {account.slice(-4)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* RainbowKit Connect Button */}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === "authenticated");

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button
                            onClick={openConnectModal}
                            className="rounded-xl border-4 border-black bg-[#00C7B7] px-6 py-3 text-lg font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          >
                            Connect Wallet
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button
                            onClick={openChainModal}
                            className="rounded-xl border-4 border-black bg-[#FF6B6B] px-4 py-2 font-bold text-black"
                          >
                            Wrong Network
                          </Button>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={openChainModal}
                            variant="outline"
                            className="rounded-xl border-4 border-black bg-white px-3 py-2 font-mono text-sm font-bold text-black"
                          >
                            {chain.hasIcon && chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                className="mr-2 h-4 w-4"
                              />
                            )}
                            {chain.name}
                          </Button>

                          <Button
                            onClick={openAccountModal}
                            className="rounded-xl border-4 border-black bg-[#FFD447] px-4 py-2 font-mono text-sm font-bold text-black"
                          >
                            {account.displayName}
                            {account.displayBalance
                              ? ` (${account.displayBalance})`
                              : ""}
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </nav>
  );
}
