"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/hooks/use-gsap"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const orbsRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Title animation
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 },
    )

    // Subtitle animation
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.5 },
    )

    // Buttons animation
    gsap.fromTo(
      buttonsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.8 },
    )

    // Orbs infinite animation
    if (orbsRef.current) {
      const orbs = orbsRef.current.querySelectorAll(".data-orb")
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          rotation: 360,
          duration: 20 + i * 5,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center",
        })
      })

      // Pulse animation for center
      gsap.to(".center-wallet", {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })

      // Data lines pulse
      gsap.to(".data-line", {
        opacity: 0.3,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: "power1.inOut",
      })
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />

      {/* Animated 2D Hero Visual */}
      <div ref={orbsRef} className="relative w-80 h-80 md:w-96 md:h-96 mb-12">
        {/* Center Wallet */}
        <div className="center-wallet absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-card neo-border rounded-2xl flex items-center justify-center z-10">
          <svg
            className="w-12 h-12 md:w-16 md:h-16 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <path d="M16 10h.01" />
            <path d="M2 10h20" />
          </svg>
        </div>

        {/* Orbiting Data Orbs */}
        <div className="data-orb absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary neo-border-sm rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">FDC</span>
          </div>
        </div>
        <div className="data-orb absolute inset-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-secondary neo-border-sm rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-secondary-foreground">FTSO</span>
          </div>
        </div>
        <div className="data-orb absolute inset-0" style={{ animationDelay: "1s" }}>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 bg-accent neo-border-sm rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold">$</span>
          </div>
        </div>
        <div className="data-orb absolute inset-0" style={{ animationDelay: "2s" }}>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 bg-card neo-border-sm rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold">AI</span>
          </div>
        </div>

        {/* Connecting Lines SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
          <line
            className="data-line"
            x1="200"
            y1="50"
            x2="200"
            y2="150"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="8 4"
          />
          <line
            className="data-line"
            x1="200"
            y1="250"
            x2="200"
            y2="350"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="8 4"
          />
          <line
            className="data-line"
            x1="50"
            y1="200"
            x2="150"
            y2="200"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="8 4"
          />
          <line
            className="data-line"
            x1="250"
            y1="200"
            x2="350"
            y2="200"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="8 4"
          />
        </svg>
      </div>

      {/* Text Content */}
      <h1
        ref={titleRef}
        className="text-4xl md:text-6xl lg:text-7xl font-bold text-center max-w-5xl mb-6 leading-tight text-balance"
      >
        <span className="text-foreground">InfoPilot —</span>{" "}
        <span className="text-primary">The Self-Driving Smart Account.</span>
      </h1>

      <p ref={subtitleRef} className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-10">
        Powered by Flare FDC + FTSO + Smart Accounts.
      </p>

      {/* CTA Buttons */}
      <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
        <button className="neo-button px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-bold">
          Launch Demo
        </button>
        <button className="neo-button px-8 py-4 bg-card text-foreground rounded-xl text-lg font-bold">
          View Smart Contract
        </button>
      </div>
    </section>
  )
}
