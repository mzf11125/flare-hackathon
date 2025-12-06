"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/hooks/use-gsap"

const extensions = [
  {
    title: "Multi-Chain Support",
    description: "Expand to Ethereum, Arbitrum, and more",
    icon: "🌐",
  },
  {
    title: "AI-Enhanced Signals",
    description: "Machine learning for better predictions",
    icon: "🤖",
  },
  {
    title: "Social Trading",
    description: "Copy successful strategies from others",
    icon: "👥",
  },
  {
    title: "NFT Integration",
    description: "Premium features as tradeable NFTs",
    icon: "🎨",
  },
  {
    title: "Mobile App",
    description: "Monitor and manage on the go",
    icon: "📱",
  },
  {
    title: "Governance Token",
    description: "Community-driven protocol updates",
    icon: "🗳️",
  },
]

export function FutureExtensionsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    cardsRef.current.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          scale: 1.05,
          duration: 0.2,
          ease: "power2.out",
        })
      })

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        })
      })

      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      )
    })
  }, [])

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  return (
    <section ref={sectionRef} className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Future <span className="text-primary">Extensions</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {extensions.map((ext) => (
            <div key={ext.title} ref={addToRefs} className="neo-border bg-card rounded-2xl p-6 cursor-pointer">
              <div className="text-4xl mb-4">{ext.icon}</div>
              <h3 className="text-xl font-bold mb-2">{ext.title}</h3>
              <p className="text-muted-foreground">{ext.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
