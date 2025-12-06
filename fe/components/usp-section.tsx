"use client"

import { useEffect, useRef } from "react"
import { gsap, useGsapStagger } from "@/hooks/use-gsap"

export function UspSection() {
  const cardsRef = useGsapStagger()
  const underlineRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!underlineRef.current) return

    const length = underlineRef.current.getTotalLength()

    gsap.set(underlineRef.current, {
      strokeDasharray: length,
      strokeDashoffset: length,
    })

    gsap.to(underlineRef.current, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: underlineRef.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    })
  }, [])

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-2">
            Why It{" "}
            <span className="relative inline-block">
              Matters
              <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 200 20">
                <path
                  ref={underlineRef}
                  d="M0 10 Q50 0 100 10 T200 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-primary"
                />
              </svg>
            </span>
          </h2>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8">
          <div className="neo-border bg-card rounded-2xl p-8 hover:translate-y-[-4px] transition-transform">
            <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-6 neo-border-sm">
              <svg
                className="w-10 h-10 text-primary-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Multi-Source Decision Engine</h3>
            <p className="text-muted-foreground text-lg">
              Powered by FDC off-chain signals + FTSO price feeds for comprehensive data analysis.
            </p>
          </div>

          <div className="neo-border bg-card rounded-2xl p-8 hover:translate-y-[-4px] transition-transform">
            <div className="w-20 h-20 bg-secondary rounded-xl flex items-center justify-center mb-6 neo-border-sm">
              <svg
                className="w-10 h-10 text-secondary-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">Autonomous Smart Account Execution</h3>
            <p className="text-muted-foreground text-lg">
              Rules execute themselves via Account Abstraction with no manual intervention required.
            </p>
          </div>

          <div className="neo-border bg-card rounded-2xl p-8 hover:translate-y-[-4px] transition-transform">
            <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-6 neo-border-sm">
              <svg
                className="w-10 h-10 text-primary-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
                <path d="M12 2a10 10 0 0 1 10 10" />
                <circle cx="12" cy="12" r="6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">True Information Finance</h3>
            <p className="text-muted-foreground text-lg">
              A wallet that acts on information, not only price. Welcome to InfoFi.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
