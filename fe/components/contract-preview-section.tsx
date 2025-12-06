"use client"

import { useGsapSlideIn } from "@/hooks/use-gsap"

const sampleCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@flare/FtsoV2Interface.sol";
import "@flare/FdcInterface.sol";

contract InfoPilot {
    FtsoV2Interface public ftso;
    FdcInterface public fdc;
    
    struct TradingRule {
        uint256 sentimentThreshold;
        uint256 priceDropThreshold;
        address tokenIn;
        address tokenOut;
    }
    
    mapping(address => TradingRule) public userRules;
    
    function setRule(
        uint256 _sentiment,
        uint256 _priceDrop,
        address _tokenIn,
        address _tokenOut
    ) external {
        userRules[msg.sender] = TradingRule({
            sentimentThreshold: _sentiment,
            priceDropThreshold: _priceDrop,
            tokenIn: _tokenIn,
            tokenOut: _tokenOut
        });
    }
    
    function checkAndExecute(address user) external {
        TradingRule memory rule = userRules[user];
        uint256 sentiment = fdc.getSentiment();
        uint256 priceChange = ftso.getPriceChange();
        
        if (sentiment < rule.sentimentThreshold && 
            priceChange > rule.priceDropThreshold) {
            _executeSwap(user, rule);
        }
    }
}`

export function ContractPreviewSection() {
  const ref = useGsapSlideIn("left")

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Smart Contract <span className="text-primary">Preview</span>
        </h2>

        <div ref={ref} className="neo-border bg-foreground text-background rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b-3 border-border bg-muted/10">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-sm text-muted-foreground font-mono">InfoPilot.sol</span>
          </div>
          <pre className="p-6 overflow-x-auto text-sm md:text-base font-mono">
            <code className="text-green-400">{sampleCode}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
