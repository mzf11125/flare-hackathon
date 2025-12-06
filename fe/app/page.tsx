import { HeroSection } from "@/components/hero-section"
import { WhatIsSection } from "@/components/what-is-section"
import { UspSection } from "@/components/usp-section"
import { ArchitectureSection } from "@/components/architecture-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { DemoFlowSection } from "@/components/demo-flow-section"
import { TechStackSection } from "@/components/tech-stack-section"
import { ContractPreviewSection } from "@/components/contract-preview-section"
import { FutureExtensionsSection } from "@/components/future-extensions-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <WhatIsSection />
      <UspSection />
      <ArchitectureSection />
      <HowItWorksSection />
      <DemoFlowSection />
      <TechStackSection />
      <ContractPreviewSection />
      <FutureExtensionsSection />
      <Footer />
    </main>
  )
}
