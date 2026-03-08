import Image from "next/image"
import { Sparkles, Mic, Award } from "lucide-react"

const criteria = [
  {
    icon: Sparkles,
    title: "Ma\u00eetrise Technique",
    description:
      "Un niveau professionnel exceptionnel et une rigueur technique irr\u00e9prochable dans votre discipline.",
  },
  {
    icon: Mic,
    title: "Pr\u00e9sence Sc\u00e9nique",
    description:
      "Une capacit\u00e9 \u00e0 captiver l'auditoire par votre charisme et votre interpr\u00e9tation \u00e9motionnelle.",
  },
  {
    icon: Award,
    title: "\u00c9l\u00e9gance & Prestige",
    description:
      "Une esth\u00e9tique en accord avec l'univers haut de gamme de notre gala annuel.",
  },
]

export function CriteriaSection() {
  return (
    <section id="criteres" className="py-20 lg:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden max-w-md mx-auto lg:mx-0">
            <Image
              src="/images/selection-criteria.jpg"
              alt="Artiste en performance"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Excellence
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 text-balance">
              {"Nos Crit\u00e8res de S\u00e9lection"}
            </h2>

            <div className="flex flex-col gap-8">
              {criteria.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
