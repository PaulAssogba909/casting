"use client"

import { CalendarDays, Clock, MapPin, Users } from "lucide-react"

const EVENTS = [
  {
    title: "Casting - La Magie du Soir 2026",
    date: "20 Avril 2026",
    time: "13h00",
    location: "Cotonou, B\u00e9nin",
    description: "Casting officiel pour toutes les cat\u00e9gories artistiques. Inscription : 5.000 FCFA.",
    attendees: 1284,
    status: "\u00c0 venir",
  },
  {
    title: "Auditions Priv\u00e9es",
    date: "D\u00e9cembre 2025",
    time: "10h00",
    location: "Studio La Magie",
    description: "S\u00e9lection des finalistes devant le jury d'experts.",
    attendees: 200,
    status: "Termin\u00e9",
  },
  {
    title: "Gala de Prestige",
    date: "Mars 2026",
    time: "19h00",
    location: "Palais de la Musique",
    description: "La grande soir\u00e9e de repr\u00e9sentation avec les laur\u00e9ats de chaque cat\u00e9gorie.",
    attendees: 500,
    status: "Planifi\u00e9",
  },
]

export default function EventsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{"\u00c9v\u00e9nements"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {"Calendrier des \u00e9v\u00e9nements li\u00e9s au casting"}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {EVENTS.map((event, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === "\u00c0 venir"
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : event.status === "Termin\u00e9"
                      ? "bg-green-500/10 text-green-500 border border-green-500/30"
                      : "bg-muted-foreground/10 text-muted-foreground border border-muted-foreground/30"
                  }`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    {event.attendees} participants
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
