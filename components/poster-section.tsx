import Image from "next/image"

export function PosterSection() {
  return (
    <section id="poster" className="py-20 lg:py-28 px-4 bg-secondary/30">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
          <Image
            src="/images/poster.jpg"
            alt="Affiche officielle du casting La Magie du Soir 2026"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 text-center lg:text-left">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Affiche Officielle
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
            Gala des Acteurs Culturels
          </h2>
          <div className="flex flex-col gap-4 text-muted-foreground text-sm leading-relaxed">
            <p>
              <span className="text-foreground font-semibold">Talents recherch{"e"}s :</span>{" "}
              {"Artistes chanteurs, Slameurs, Danseurs & Groupes de Danse moderne / traditionnelles, Com\u00e9diens, Stylistes / Cr\u00e9ateurs de Mode, Artistes Plasticiens"}
            </p>
            <p>
              <span className="text-foreground font-semibold">Inscription :</span> 5.000 FCFA
            </p>
            <p>
              <span className="text-foreground font-semibold">Date :</span> 20 Avril 2026 {"a"} 13H00
            </p>
            <p className="text-primary italic font-medium mt-2">
              {"NB : Le laur\u00e9at de chaque cat\u00e9gorie repartira avec un troph\u00e9e."}
            </p>
            <p className="italic text-foreground/80 mt-2">
              {"Jeune artiste, assez rest\u00e9 dans l'ombre ? Viens briller sous les projecteurs !"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
