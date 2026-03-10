"use client"

import { useEffect, useMemo, useState } from "react"
import { Mic, Music, Megaphone, Palette, Drama, Shirt } from "lucide-react"

type StatusKey = "nouveau" | "reviewing" | "approved" | "rejected"

interface Candidate {
  id: string
  fields: {
    Catégorie?: string
    Categorie?: string
    Statut?: string
    [key: string]: any
  }
}

const CATEGORY_ICONS: Record<string, any> = {
  "Chanteur": Mic,
  "Danse": Music,
  "Slammer": Megaphone,
  "Styliste": Shirt,
  "Théâtre": Drama,
  "Artiste Plasticien": Palette,
  "Plasticien": Palette,
}

function normalizeStatus(value?: string): StatusKey {
  const raw = (value || "").trim().toLowerCase()
  if (raw === "approved" || raw === "approuvé" || raw === "approuve") return "approved"
  if (raw === "reviewing" || raw === "en revue" || raw === "review") return "reviewing"
  if (raw === "rejected" || raw === "rejeté" || raw === "rejete") return "rejected"
  return "nouveau"
}

export default function CategoriesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/candidates", { cache: "no-store" })
        const data = await res.json()
        const records = Array.isArray(data) ? data : Array.isArray(data?.records) ? data.records : []
        setCandidates(records)
      } catch (error) {
        console.error("Erreur chargement catégories:", error)
        setCandidates([])
      } finally {
        setLoading(false)
      }
    }
    fetchCandidates()
  }, [])

  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; approved: number; reviewing: number; rejected: number; nouveau: number }> = {}

    candidates.forEach((candidate) => {
      const category = candidate.fields.Catégorie || candidate.fields.Categorie || "Autre"
      const status = normalizeStatus(candidate.fields.Statut)

      if (!stats[category]) {
        stats[category] = { total: 0, approved: 0, reviewing: 0, rejected: 0, nouveau: 0 }
      }

      stats[category].total += 1
      stats[category][status] += 1
    })

    return Object.entries(stats)
      .map(([name, data]) => ({
        name,
        icon: CATEGORY_ICONS[name] || Mic,
        ...data,
      }))
      .sort((a, b) => b.total - a.total)
  }, [candidates])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Catégories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vue d&apos;ensemble des candidatures par catégorie artistique
        </p>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-12">
          Chargement des statistiques...
        </div>
      ) : categoryStats.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          Aucune candidature trouvée.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryStats.map((cat) => {
            const Icon = cat.icon
            const approvedPct = cat.total ? Math.round((cat.approved / cat.total) * 100) : 0

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
                    <p className="text-sm text-muted-foreground">
                      {cat.total} candidature{cat.total > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 text-sm mb-4">
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs mb-1">Approuvés</p>
                    <p className="text-green-500 font-semibold">{cat.approved}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs mb-1">En revue</p>
                    <p className="text-primary font-semibold">{cat.reviewing}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs mb-1">Rejetés</p>
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
                  {approvedPct}% taux d&apos;approbation
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
