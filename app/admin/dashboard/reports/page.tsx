"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, FileText, TrendingUp, Users, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

type StatusKey = "nouveau" | "reviewing" | "approved" | "rejected"

interface Candidate {
  id: string
  fields: {
    Nom?: string
    Prénoms?: string
    Email?: string
    Catégorie?: string
    Categorie?: string
    Statut?: string
    Ville?: string
    Téléphone?: string
    [key: string]: any
  }
}

function normalizeStatus(value?: string): StatusKey {
  const raw = (value || "").trim().toLowerCase()
  if (raw === "approved" || raw === "approuvé" || raw === "approuve") return "approved"
  if (raw === "reviewing" || raw === "en revue" || raw === "review") return "reviewing"
  if (raw === "rejected" || raw === "rejeté" || raw === "rejete") return "rejected"
  return "nouveau"
}

function getStatusLabel(status: StatusKey): string {
  switch (status) {
    case "approved": return "Approuvé"
    case "reviewing": return "En revue"
    case "rejected": return "Rejeté"
    default: return "Nouveau"
  }
}

export default function ReportsPage() {
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
        console.error("Erreur chargement rapports:", error)
        setCandidates([])
      } finally {
        setLoading(false)
      }
    }
    fetchCandidates()
  }, [])

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {}
    candidates.forEach((c) => {
      const cat = c.fields.Catégorie || c.fields.Categorie || "Autre"
      stats[cat] = (stats[cat] || 0) + 1
    })
    return Object.entries(stats)
      .map(([name, candidatures]) => ({ name, candidatures }))
      .sort((a, b) => b.candidatures - a.candidatures)
  }, [candidates])

  const downloadCSV = (type: string) => {
    let csvContent = ""
    let filename = ""

    if (type === "global") {
      filename = "rapport-global-candidatures.csv"
      csvContent = "Nom,Prénoms,Email,Catégorie,Ville,Téléphone,Statut\n"
      candidates.forEach((c) => {
        const row = [
          c.fields.Nom || "",
          c.fields.Prénoms || "",
          c.fields.Email || "",
          c.fields.Catégorie || c.fields.Categorie || "",
          c.fields.Ville || "",
          c.fields.Téléphone || "",
          getStatusLabel(normalizeStatus(c.fields.Statut)),
        ].map(val => `"${val}"`).join(",")
        csvContent += row + "\n"
      })
    } else if (type === "categories") {
      filename = "statistiques-par-categorie.csv"
      csvContent = "Catégorie,Nombre de candidatures\n"
      categoryStats.forEach((cat) => {
        csvContent += `"${cat.name}",${cat.candidatures}\n`
      })
    } else if (type === "approved") {
      filename = "candidats-approuves.csv"
      csvContent = "Nom,Prénoms,Email,Catégorie,Ville,Téléphone\n"
      candidates
        .filter((c) => normalizeStatus(c.fields.Statut) === "approved")
        .forEach((c) => {
          const row = [
            c.fields.Nom || "",
            c.fields.Prénoms || "",
            c.fields.Email || "",
            c.fields.Catégorie || c.fields.Categorie || "",
            c.fields.Ville || "",
            c.fields.Téléphone || "",
          ].map(val => `"${val}"`).join(",")
          csvContent += row + "\n"
        })
    } else if (type === "evolution") {
      filename = "evolution-inscriptions.csv"
      csvContent = "Catégorie,Total,Approuvés,En revue,Rejetés,Nouveaux\n"
      const stats: Record<string, { total: number; approved: number; reviewing: number; rejected: number; nouveau: number }> = {}
      candidates.forEach((c) => {
        const cat = c.fields.Catégorie || c.fields.Categorie || "Autre"
        const status = normalizeStatus(c.fields.Statut)
        if (!stats[cat]) stats[cat] = { total: 0, approved: 0, reviewing: 0, rejected: 0, nouveau: 0 }
        stats[cat].total += 1
        stats[cat][status] += 1
      })
      Object.entries(stats).forEach(([cat, data]) => {
        csvContent += `"${cat}",${data.total},${data.approved},${data.reviewing},${data.rejected},${data.nouveau}\n`
      })
    }

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const REPORTS = [
    { name: "Rapport global des candidatures", type: "global", icon: FileText },
    { name: "Statistiques par catégorie", type: "categories", icon: Tag },
    { name: "Évolution des inscriptions", type: "evolution", icon: TrendingUp },
    { name: "Profils des candidats approuvés", type: "approved", icon: Users },
  ]

  const total = candidates.length
  const approved = candidates.filter(c => normalizeStatus(c.fields.Statut) === "approved").length
  const reviewing = candidates.filter(c => normalizeStatus(c.fields.Statut) === "reviewing").length

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Rapports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Analyses et rapports de performance du casting
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total candidatures</p>
          <p className="text-2xl font-bold text-foreground">{loading ? "..." : total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Approuvés</p>
          <p className="text-2xl font-bold text-green-500">{loading ? "..." : approved}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">En revue</p>
          <p className="text-2xl font-bold text-primary">{loading ? "..." : reviewing}</p>
        </div>
      </div>

      {/* Graphique */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Candidatures par catégorie
        </h2>
        {loading ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Chargement du graphique...
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3d3425" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#a0946e", fontSize: 12 }}
                  axisLine={{ stroke: "#3d3425" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#a0946e", fontSize: 12 }}
                  axisLine={{ stroke: "#3d3425" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1610",
                    border: "1px solid #3d3425",
                    borderRadius: "8px",
                    color: "#f5f0e8",
                  }}
                />
                <Bar dataKey="candidatures" fill="#d4a017" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Rapports téléchargeables */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-foreground">
          Rapports téléchargeables
        </h2>
        {REPORTS.map((report) => {
          const Icon = report.icon
          return (
            <div
              key={report.type}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">{report.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {total} entrées disponibles
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadCSV(report.type)}
                disabled={loading || candidates.length === 0}
                className="border-border text-muted-foreground hover:text-primary hover:border-primary"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
