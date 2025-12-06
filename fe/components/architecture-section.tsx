"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/hooks/use-gsap"

export function ArchitectureSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const blocksRef = useRef<HTMLDivElement[]>([])
  const linesRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    // Animate blocks
    blocksRef.current.forEach((block, i) => {
      gsap.fromTo(
        block,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: i * 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        },
      )
    })

    // Animate connecting lines
    if (linesRef.current) {
      const lines = linesRef.current.querySelectorAll("line")
      lines.forEach((line, i) => {
        const length = Math.sqrt(
          Math.pow(
            Number.parseFloat(line.getAttribute("x2") || "0") - Number.parseFloat(line.getAttribute("x1") || "0"),
            2,
          ) +
            Math.pow(
              Number.parseFloat(line.getAttribute("y2") || "0") - Number.parseFloat(line.getAttribute("y1") || "0"),
              2,
            ),
        )

        gsap.fromTo(
          line,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 0.8,
            delay: 0.5 + i * 0.2,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          },
        )
      })
    }
  }, [])

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !blocksRef.current.includes(el)) {
      blocksRef.current.push(el)
    }
  }

  return (
    <section ref={sectionRef} className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          System <span className="text-primary">Architecture</span>
        </h2>

        <div className="relative">
          {/* SVG Lines Container */}
          <svg ref={linesRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ height: "100%" }}>
            <line x1="50%" y1="80" x2="50%" y2="130" stroke="currentColor" strokeWidth="3" className="text-primary" />
            <line x1="50%" y1="200" x2="50%" y2="250" stroke="currentColor" strokeWidth="3" className="text-primary" />
            <line x1="50%" y1="320" x2="50%" y2="370" stroke="currentColor" strokeWidth="3" className="text-primary" />
            <line x1="50%" y1="440" x2="50%" y2="490" stroke="currentColor" strokeWidth="3" className="text-primary" />
          </svg>

          <div className="flex flex-col items-center gap-8 relative z-10">
            <div
              ref={addToRefs}
              className="neo-border bg-primary text-primary-foreground rounded-2xl px-8 py-6 text-center w-full max-w-sm"
            >
              <h3 className="text-xl font-bold">FDC</h3>
              <p className="text-sm opacity-80">Sentiment Feed</p>
            </div>

            <div
              ref={addToRefs}
              className="neo-border bg-secondary text-secondary-foreground rounded-2xl px-8 py-6 text-center w-full max-w-sm"
            >
              <h3 className="text-xl font-bold">FTSO</h3>
              <p className="text-sm opacity-80">Price Feed</p>
            </div>

            <div
              ref={addToRefs}
              className="neo-border bg-card text-foreground rounded-2xl px-8 py-6 text-center w-full max-w-md"
            >
              <h3 className="text-xl font-bold">Combined Info Decision Layer</h3>
              <p className="text-sm text-muted-foreground">Intelligent signal processing</p>
            </div>

            <div
              ref={addToRefs}
              className="neo-border bg-primary text-primary-foreground rounded-2xl px-8 py-6 text-center w-full max-w-sm"
            >
              <h3 className="text-xl font-bold">AutoSwap Executor</h3>
              <p className="text-sm opacity-80">Automated trading engine</p>
            </div>

            <div
              ref={addToRefs}
              className="neo-border bg-secondary text-secondary-foreground rounded-2xl px-8 py-6 text-center w-full max-w-md"
            >
              <h3 className="text-xl font-bold">Portfolio Reallocation</h3>
              <p className="text-sm opacity-80">Smart rebalancing</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
