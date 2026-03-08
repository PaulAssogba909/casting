import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { CriteriaSection } from "@/components/criteria-section"
import { PosterSection } from "@/components/poster-section"
import { TimelineSection } from "@/components/timeline-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <CriteriaSection />
      <PosterSection />
      <TimelineSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
