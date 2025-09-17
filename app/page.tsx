import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"
import ScrollTriggered from "@/components/scroll-triggered"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ScrollTriggered />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
