import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { LiveStats } from "@/components/live-stats"
import { SocialProof } from "@/components/social-proof"
import { FeaturesSection } from "@/components/features-section"
import { MenuCarousel } from "@/components/menu-carousel"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { SuccessStory } from "@/components/success-story"
import { PricingSection } from "@/components/pricing-section"
import { FAQ, ContactForm } from "@/components/faq-contact"
import { Footer } from "@/components/footer"
import ScrollTriggered from "@/components/scroll-triggered"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <LiveStats />
        <SocialProof />
        <ScrollTriggered />
        <FeaturesSection />
        <MenuCarousel />
        <HowItWorks />
        <Testimonials />
        <SuccessStory />
        <PricingSection />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}
