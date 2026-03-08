const steps = [
  {
    number: "01",
    period: "Mars 2026",
    title: "Ouverture des Inscriptions",
    description:
      "Soumettez votre candidature compl\u00e8te via notre plateforme en ligne.",
  },
  {
    number: "02",
    highlight: true,
    period: "Avril 2026",
    title: "Casting & Auditions",
    description:
      "S\u00e9lection des finalistes le 20 avril 2026 \u00e0 13h00. Inscription : 5.000 FCFA.",
  },
  {
    number: "03",
    period: "Mai 2026",
    title: "Gala de Prestige",
    description:
      "La grande soir\u00e9e de repr\u00e9sentation. Le laur\u00e9at de chaque cat\u00e9gorie repartira avec un troph\u00e9e.",
  },
]

export function TimelineSection() {
  return (
    <section id="dates" className="py-20 lg:py-28 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
          Calendrier
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
          {"\u00c9tapes de Recrutement"}
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-14 leading-relaxed">
          {"Notez les dates cl\u00e9s pour ne pas manquer votre chance de briller."}
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`relative rounded-2xl p-6 text-left ${
                step.highlight
                  ? "border-2 border-primary bg-primary/5"
                  : "border border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p
                    className={`text-xs font-bold uppercase tracking-wider ${
                      step.highlight ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.period}
                  </p>
                  <h3 className="text-foreground font-bold text-lg mt-1">{step.title}</h3>
                </div>
                <span className="text-5xl font-black text-border/60">{step.number}</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
