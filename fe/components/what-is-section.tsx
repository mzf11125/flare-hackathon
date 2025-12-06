"use client"

import { useGsapStagger } from "@/hooks/use-gsap"

export function WhatIsSection() {
  const cardsRef = useGsapStagger()

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          What is <span className="text-primary">InfoPilot</span>?
        </h2>

        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="neo-border bg-card rounded-2xl p-8">
            <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Autonomous Trading</h3>
            <p className="text-muted-foreground">
              InfoPilot is an autonomous trading and risk-mitigation agent built on the Flare Network.
            </p>
          </div>

          <div className="neo-border bg-card rounded-2xl p-8">
            <div className="w-16 h-16 bg-secondary/20 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-secondary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Real-World Signals</h3>
            <p className="text-muted-foreground">
              It reacts to real-world signals + on-chain prices for intelligent decision making.
            </p>
          </div>

          <div className="neo-border bg-card rounded-2xl p-8 md:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4">Information Finance</h3>
            <p className="text-muted-foreground">
              Creating the world's first InfoFi — Information Finance — smart account.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
