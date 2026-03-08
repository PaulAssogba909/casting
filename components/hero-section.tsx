import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/images/hero-curtain.jpg"
        alt="Rideau de theatre dore"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

      <div className="relative z-10 text-center px-4 py-32 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-full px-4 py-1.5 mb-8">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-xs font-semibold uppercase tracking-wider">
            Casting Officiel 2026
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance mb-4">
          {"L'\u00c9clat de la Sc\u00e8ne"}
          <br />
          <span className="text-primary italic">Vous Attend</span>
        </h1>

        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          {"Rejoignez l'\u00e9lite artistique pour une soir\u00e9e de gala prestigieuse. Nous recherchons les talents les plus raffin\u00e9s pour sublimer l'\u00e9dition 2026."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/casting">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-8 py-6">
              {"S'INSCRIRE MAINTENANT"}
            </Button>
          </Link>
          <Link href="#poster">
            <Button variant="outline" size="lg" className="border-foreground/30 text-foreground hover:bg-foreground/10 font-semibold text-base px-8 py-6">
              VOIR L{"'"}AFFICHE
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
