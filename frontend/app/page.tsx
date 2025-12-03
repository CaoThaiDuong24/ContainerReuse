import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import BenefitsSection from "@/components/benefits-section"
import StatsSection from "@/components/stats-section"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background">
      <Header />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
