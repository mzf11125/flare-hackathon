"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function useGsapFadeIn(options?: { delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.fromTo(
      ref.current,
      { opacity: 0, y: options?.y ?? 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: options?.delay ?? 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    )
  }, [options?.delay, options?.y])

  return ref
}

export function useGsapStagger() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const children = ref.current.children

    gsap.fromTo(
      children,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    )
  }, [])

  return ref
}

export function useGsapSlideIn(direction: "left" | "right" = "left") {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.fromTo(
      ref.current,
      { opacity: 0, x: direction === "left" ? -100 : 100 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    )
  }, [direction])

  return ref
}

export function useGsapDrawLine() {
  const ref = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const length = ref.current.getTotalLength()

    gsap.set(ref.current, {
      strokeDasharray: length,
      strokeDashoffset: length,
    })

    gsap.to(ref.current, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    })
  }, [])

  return ref
}

export { gsap, ScrollTrigger }
