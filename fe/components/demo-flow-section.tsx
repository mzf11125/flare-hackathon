"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/hooks/use-gsap"

const timelineSteps = [
  { label: "Create rule", status: "complete", detail: "If sentiment < 40% AND price drops > 5%" },
  { label: "Show sentiment", status: "complete", detail: "FDC: Current sentiment = 35%" },
  { label: "Show price", status: "complete", detail: "FTSO: ETH -6.2% in 24h" },
  { label: "Evaluate", status: "active", detail: "Conditions met ✓" },
  { label: "Auto-swap executed", status: "pending", detail: "ETH → USDC complete" },
]

export function DemoFlowSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    stepsRef.current.forEach((step, i) => {
      gsap.fromTo(
        step,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      )
    })
  }, [])

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !stepsRef.current.includes(el)) {
      stepsRef.current.push(el)
    }
  }

  return (
    <section ref={sectionRef} className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Demo <span className="text-primary">Flow</span>
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-border" />

          <div className="space-y-8">
            {timelineSteps.map((step, i) => (
              <div key={step.label} ref={addToRefs} className="relative flex items-start gap-6 pl-16">
                {/* Timeline dot */}
                <div
                  className={`absolute left-4 w-5 h-5 rounded-full border-4 ${
                    step.status === "complete"
                      ? "bg-primary border-primary"
                      : step.status === "active"
                        ? "bg-secondary border-secondary animate-pulse"
                        : "bg-card border-border"
                  }`}
                />

                <div className="neo-border bg-card rounded-xl p-6 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold">{step.label}</h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        step.status === "complete"
                          ? "bg-primary/20 text-primary"
                          : step.status === "active"
                            ? "bg-secondary/20 text-secondary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-mono text-sm">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
