"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/hooks/use-gsap"

const technologies = [
  { name: "Solidity", color: "#363636" },
  { name: "Next.js", color: "#000000" },
  { name: "FTSO", color: "#E62058" },
  { name: "FDC", color: "#00C7B7" },
  { name: "Coston2", color: "#E62058" },
  { name: "Tailwind", color: "#06B6D4" },
  { name: "GSAP", color: "#88CE02" },
]

export function TechStackSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    iconsRef.current.forEach((icon, i) => {
      // Float animation
      gsap.to(icon, {
        y: -8,
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: i * 0.2,
      })

      // Scroll reveal
      gsap.fromTo(
        icon,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: i * 0.1,
          ease: "back.out(1.7)",
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
    if (el && !iconsRef.current.includes(el)) {
      iconsRef.current.push(el)
    }
  }

  return (
    <section ref={sectionRef} className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Tech <span className="text-primary">Stack</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {technologies.map((tech, i) => (
            <div
              key={tech.name}
              ref={addToRefs}
              className="neo-border bg-card rounded-2xl p-6 flex flex-col items-center gap-4 w-28 md:w-36 hover:scale-105 transition-transform cursor-pointer"
            >
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-card"
                style={{ backgroundColor: tech.color }}
              >
                {tech.name.charAt(0)}
              </div>
              <span className="font-semibold text-sm md:text-base">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
