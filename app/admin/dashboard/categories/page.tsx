"use client"

import { User, Palette, Music, Drama, Mic, Megaphone } from "lucide-react"

const CATEGORIES = [
  { name: "Chanteur", icon: Mic, total: 342, approved: 210, reviewing: 80, rejected: 52 },
  { name: "Danse", icon: Music, total: 285, approved: 180, reviewing: 65, rejected: 40 },
  { name: "Slammer", icon: Megaphone, total: 198, approved: 120, reviewing: 48, rejected: 30 },
  { name: "Styliste", icon: User, total: 176, approved: 95, reviewing: 52, rejected: 29 },
  { name: "Th\u00e9\u00e2tre", icon: Drama, total: 158, approved: 85, reviewing: 45, rejected: 28 },
  { name: "Artiste Plasticien", icon: Palette, total: 125, approved: 60, reviewing: 42, rejected: 23 },
]

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{"Cat\u00e9gories"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {"Vue d'ensemble des candidatures par cat\u00e9gorie artistique"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const approvedPct = Math.round((cat.approved / cat.total) * 100)
          return (
            <div
              key={cat.name}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.total} candidatures</p>
                </div>
              </div>

              <div className="flex gap-4 text-sm mb-4">
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs mb-1">{"Approuv\u00e9s"}</p>
                  <p className="text-green-500 font-semibold">{cat.approved}</p>
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs mb-1">En revue</p>
                  <p className="text-primary font-semibold">{cat.reviewing}</p>
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs mb-1">{"Rejet\u00e9s"}</p>
                  <p className="text-destructive font-semibold">{cat.rejected}</p>
                </div>
              </div>

              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${approvedPct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {approvedPct}% taux d{"'"}approbation
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
