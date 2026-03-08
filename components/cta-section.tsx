import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-card border border-border rounded-3xl p-10 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            {"Pr\u00eat \u00e0 entrer dans l'histoire ?"}
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
            {"Les places sont limit\u00e9es. Soumettez votre candidature d\u00e8s aujourd'hui pour faire partie de l'\u00e9v\u00e9nement le plus prestigieux de l'ann\u00e9e."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/casting">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-8 py-6"
              >
                REJOINDRE LE CASTING
              </Button>
            </Link>
            <a href="tel:+22901975096422">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-base px-8 py-6"
              >
                <Phone className="h-5 w-5 mr-2" />
                Appeler pour plus d{"'"}info
              </Button>
            </a>
          </div>
          <p className="text-muted-foreground text-xs mt-6">
            Inscriptions ouvertes jusqu{"'"}au 15 Avril 2026
          </p>
        </div>
      </div>
    </section>
  )
}
