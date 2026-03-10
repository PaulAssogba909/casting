"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, FileText, TrendingUp, Users, Tag, BarChart3, PieChart, CheckCircle2, Clock, XCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Area,
  AreaChart,
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

const STATUS_COLORS = {
  nouveau: "#3b82f6",
  reviewing: "#d4a017",
  approved: "#22c55e",
  rejected: "#ef4444",
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

  const statusStats = useMemo(() => {
    const counts = { nouveau: 0, reviewing: 0, approved: 0, rejected: 0 }
    candidates.forEach((c) => {
      const status = normalizeStatus(c.fields.Statut)
      counts[status] += 1
    })
    return [
      { name: "Nouveaux", value: counts.nouveau, color: STATUS_COLORS.nouveau },
      { name: "En revue", value: counts.reviewing, color: STATUS_COLORS.reviewing },
      { name: "Approuvés", value: counts.approved, color: STATUS_COLORS.approved },
      { name: "Rejetés", value: counts.rejected, color: STATUS_COLORS.rejected },
    ]
  }, [candidates])

  const downloadCSV = (type: string) => {
    let csvContent = ""
    let filename = ""
    const today = new Date().toLocaleDateString("fr-FR")
    const separator = ";"

    if (type === "global") {
      filename = `LA_MAGIE_DU_SOIR_2026_Rapport_Global_${today.replace(/\//g, "-")}.csv`
      
      // En-tête du rapport
      csvContent = `LA MAGIE DU SOIR 2026 - RAPPORT GLOBAL DES CANDIDATURES${separator}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `Date de génération: ${today}${separator}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `Total des candidatures: ${candidates.length}${separator}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `${separator}${separator}${separator}${separator}${separator}${separator}\n`
      
      // Colonnes
      csvContent += `N°${separator}NOM${separator}PRENOMS${separator}EMAIL${separator}CATEGORIE${separator}VILLE${separator}TELEPHONE${separator}STATUT\n`
      csvContent += `${separator}${separator}${separator}${separator}${separator}${separator}${separator}\n`
      
      candidates.forEach((c, index) => {
        const row = [
          index + 1,
          (c.fields.Nom || "Non renseigné").toUpperCase(),
          c.fields.Prénoms || "Non renseigné",
          c.fields.Email || "Non renseigné",
          c.fields.Catégorie || c.fields.Categorie || "Non spécifié",
          c.fields.Ville || "Non renseigné",
          c.fields.Téléphone || "Non renseigné",
          getStatusLabel(normalizeStatus(c.fields.Statut)),
        ].map(val => `"${val}"`).join(separator)
        csvContent += row + "\n"
      })
      
      // Résumé en bas
      csvContent += `\n${separator}${separator}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `RESUME${separator}${separator}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `Approuvés: ${approved}${separator}En revue: ${reviewing}${separator}Nouveaux: ${nouveau}${separator}Rejetés: ${rejected}${separator}${separator}${separator}${separator}\n`
      
    } else if (type === "categories") {
      filename = `LA_MAGIE_DU_SOIR_2026_Statistiques_Categories_${today.replace(/\//g, "-")}.csv`
      
      // En-tête
      csvContent = `LA MAGIE DU SOIR 2026 - STATISTIQUES PAR CATEGORIE${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `Date de génération: ${today}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `${separator}${separator}${separator}${separator}${separator}\n`
      
      // Calcul des stats par catégorie avec détails
      const detailedStats: Record<string, { total: number; approved: number; reviewing: number; rejected: number; nouveau: number }> = {}
      candidates.forEach((c) => {
        const cat = c.fields.Catégorie || c.fields.Categorie || "Non spécifié"
        const status = normalizeStatus(c.fields.Statut)
        if (!detailedStats[cat]) detailedStats[cat] = { total: 0, approved: 0, reviewing: 0, rejected: 0, nouveau: 0 }
        detailedStats[cat].total += 1
        detailedStats[cat][status] += 1
      })
      
      csvContent += `CATEGORIE${separator}TOTAL${separator}APPROUVES${separator}EN REVUE${separator}NOUVEAUX${separator}REJETES${separator}TAUX APPROBATION\n`
      csvContent += `${separator}${separator}${separator}${separator}${separator}${separator}\n`
      
      Object.entries(detailedStats)
        .sort((a, b) => b[1].total - a[1].total)
        .forEach(([cat, data]) => {
          const rate = data.total > 0 ? Math.round((data.approved / data.total) * 100) : 0
          csvContent += `"${cat}"${separator}${data.total}${separator}${data.approved}${separator}${data.reviewing}${separator}${data.nouveau}${separator}${data.rejected}${separator}${rate}%\n`
        })
      
      // Total général
      csvContent += `${separator}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `TOTAL GENERAL${separator}${total}${separator}${approved}${separator}${reviewing}${separator}${nouveau}${separator}${rejected}${separator}${approvalRate}%\n`
      
    } else if (type === "approved") {
      filename = `LA_MAGIE_DU_SOIR_2026_Candidats_Selectionnes_${today.replace(/\//g, "-")}.csv`
      
      const approvedCandidates = candidates.filter((c) => normalizeStatus(c.fields.Statut) === "approved")
      
      // En-tête
      csvContent = `LA MAGIE DU SOIR 2026 - LISTE DES CANDIDATS SELECTIONNES${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `Date de génération: ${today}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `Nombre de candidats approuvés: ${approvedCandidates.length}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `${separator}${separator}${separator}${separator}${separator}\n`
      
      csvContent += `N°${separator}NOM COMPLET${separator}EMAIL${separator}TELEPHONE${separator}CATEGORIE${separator}VILLE\n`
      csvContent += `${separator}${separator}${separator}${separator}${separator}\n`
      
      approvedCandidates.forEach((c, index) => {
        const nomComplet = `${(c.fields.Nom || "").toUpperCase()} ${c.fields.Prénoms || ""}`.trim() || "Non renseigné"
        const row = [
          index + 1,
          nomComplet,
          c.fields.Email || "Non renseigné",
          c.fields.Téléphone || "Non renseigné",
          c.fields.Catégorie || c.fields.Categorie || "Non spécifié",
          c.fields.Ville || "Non renseigné",
        ].map(val => `"${val}"`).join(separator)
        csvContent += row + "\n"
      })
      
      // Répartition par catégorie
      csvContent += `\n${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `REPARTITION PAR CATEGORIE${separator}${separator}${separator}${separator}${separator}\n`
      const catCounts: Record<string, number> = {}
      approvedCandidates.forEach(c => {
        const cat = c.fields.Catégorie || c.fields.Categorie || "Non spécifié"
        catCounts[cat] = (catCounts[cat] || 0) + 1
      })
      Object.entries(catCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
        csvContent += `${cat}: ${count} candidat(s)${separator}${separator}${separator}${separator}${separator}\n`
      })
      
    } else if (type === "evolution") {
      filename = `LA_MAGIE_DU_SOIR_2026_Analyse_Complete_${today.replace(/\//g, "-")}.csv`
      
      // En-tête
      csvContent = `LA MAGIE DU SOIR 2026 - ANALYSE COMPLETE DES INSCRIPTIONS${separator}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `Date de génération: ${today}${separator}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `${separator}${separator}${separator}${separator}${separator}${separator}\n`
      
      // Section 1: Résumé global
      csvContent += `=== RESUME GLOBAL ===${separator}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `Total des candidatures${separator}${total}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `Candidats approuvés${separator}${approved}${separator}(${approvalRate}%)${separator}${separator}${separator}${separator}\n`
      csvContent += `Candidats en revue${separator}${reviewing}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `Nouvelles candidatures${separator}${nouveau}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `Candidatures rejetées${separator}${rejected}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `${separator}${separator}${separator}${separator}${separator}${separator}\n`
      
      // Section 2: Détail par catégorie
      csvContent += `=== DETAIL PAR CATEGORIE ===${separator}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `CATEGORIE${separator}TOTAL${separator}APPROUVES${separator}EN REVUE${separator}NOUVEAUX${separator}REJETES${separator}TAUX SELECTION\n`
      
      const stats: Record<string, { total: number; approved: number; reviewing: number; rejected: number; nouveau: number }> = {}
      candidates.forEach((c) => {
        const cat = c.fields.Catégorie || c.fields.Categorie || "Non spécifié"
        const status = normalizeStatus(c.fields.Statut)
        if (!stats[cat]) stats[cat] = { total: 0, approved: 0, reviewing: 0, rejected: 0, nouveau: 0 }
        stats[cat].total += 1
        stats[cat][status] += 1
      })
      
      Object.entries(stats)
        .sort((a, b) => b[1].total - a[1].total)
        .forEach(([cat, data]) => {
          const rate = data.total > 0 ? Math.round((data.approved / data.total) * 100) : 0
          csvContent += `"${cat}"${separator}${data.total}${separator}${data.approved}${separator}${data.reviewing}${separator}${data.nouveau}${separator}${data.rejected}${separator}${rate}%\n`
        })
      
      // Section 3: Répartition par ville
      csvContent += `\n=== REPARTITION PAR VILLE ===${separator}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `VILLE${separator}NOMBRE DE CANDIDATS${separator}${separator}${separator}${separator}${separator}\n`
      const villeCounts: Record<string, number> = {}
      candidates.forEach(c => {
        const ville = c.fields.Ville || "Non renseigné"
        villeCounts[ville] = (villeCounts[ville] || 0) + 1
      })
      Object.entries(villeCounts).sort((a, b) => b[1] - a[1]).forEach(([ville, count]) => {
        csvContent += `"${ville}"${separator}${count}${separator}${separator}${separator}${separator}${separator}\n`
      })
      
      // Pied de page
      csvContent += `\n${separator}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `Rapport généré automatiquement - La Magie du Soir 2026${separator}${separator}${separator}${separator}${separator}${separator}\n`
      csvContent += `Contact: +229 01 97 50 96 42 / +229 01 60 30 99 98${separator}${separator}${separator}${separator}${separator}${separator}\n`
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

  const total = candidates.length
  const approved = candidates.filter(c => normalizeStatus(c.fields.Statut) === "approved").length
  const reviewing = candidates.filter(c => normalizeStatus(c.fields.Statut) === "reviewing").length
  const rejected = candidates.filter(c => normalizeStatus(c.fields.Statut) === "rejected").length
  const nouveau = candidates.filter(c => normalizeStatus(c.fields.Statut) === "nouveau").length
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0

  const REPORTS = [
    { 
      name: "Rapport global des candidatures", 
      description: "Toutes les candidatures avec leurs informations complètes",
      type: "global", 
      icon: FileText,
      gradient: "from-blue-500/20 to-blue-600/5",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400"
    },
    { 
      name: "Statistiques par catégorie", 
      description: "Répartition des candidatures par domaine artistique",
      type: "categories", 
      icon: Tag,
      gradient: "from-primary/20 to-primary/5",
      iconBg: "bg-primary/20",
      iconColor: "text-primary"
    },
    { 
      name: "Évolution des inscriptions", 
      description: "Analyse détaillée par statut et catégorie",
      type: "evolution", 
      icon: TrendingUp,
      gradient: "from-emerald-500/20 to-emerald-600/5",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400"
    },
    { 
      name: "Profils des candidats approuvés", 
      description: "Liste des candidats sélectionnés pour le casting",
      type: "approved", 
      icon: Users,
      gradient: "from-violet-500/20 to-violet-600/5",
      iconBg: "bg-violet-500/20",
      iconColor: "text-violet-400"
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Rapports & Analyses</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1 ml-13">
            Statistiques en temps réel et exports de données
          </p>
        </div>
        <Button
          onClick={() => downloadCSV("global")}
          disabled={loading || candidates.length === 0}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Download className="h-4 w-4 mr-2" />
          Exporter tout
        </Button>
      </div>

      {/* Stats Cards avec design premium */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-5 relative overflow-hidden group hover:border-primary/30 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{loading ? "..." : total}</p>
          <p className="text-sm text-muted-foreground mt-1">Total candidatures</p>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-5 relative overflow-hidden group hover:border-green-500/30 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-500">{loading ? "..." : approved}</p>
          <p className="text-sm text-muted-foreground mt-1">Approuvés</p>
          <div className="mt-2 w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${approvalRate}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-5 relative overflow-hidden group hover:border-primary/30 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{loading ? "..." : reviewing}</p>
          <p className="text-sm text-muted-foreground mt-1">En revue</p>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-5 relative overflow-hidden group hover:border-red-500/30 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-500">{loading ? "..." : rejected}</p>
          <p className="text-sm text-muted-foreground mt-1">Rejetés</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Par catégorie</h2>
          </div>
          {loading ? (
            <div className="h-56 flex items-center justify-center text-muted-foreground">
              Chargement...
            </div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#3d3425" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#a0946e", fontSize: 12 }} axisLine={{ stroke: "#3d3425" }} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill: "#a0946e", fontSize: 11 }} axisLine={{ stroke: "#3d3425" }} tickLine={false} width={80} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1610", border: "1px solid #3d3425", borderRadius: "12px", color: "#f5f0e8" }}
                    cursor={{ fill: "rgba(212, 160, 23, 0.1)" }}
                  />
                  <Bar dataKey="candidatures" fill="#d4a017" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <PieChart className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Par statut</h2>
          </div>
          {loading ? (
            <div className="h-56 flex items-center justify-center text-muted-foreground">
              Chargement...
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={statusStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusStats.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1610", border: "1px solid #3d3425", borderRadius: "12px", color: "#f5f0e8" }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {statusStats.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-muted-foreground">{entry.name}</span>
                <span className="text-foreground font-medium">({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rapports téléchargeables - Design premium */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Download className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Exports disponibles</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORTS.map((report) => {
            const Icon = report.icon
            return (
              <div
                key={report.type}
                className={`rounded-2xl border border-border bg-gradient-to-br ${report.gradient} p-5 hover:border-primary/40 transition-all group cursor-pointer`}
                onClick={() => downloadCSV(report.type)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${report.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-6 w-6 ${report.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-foreground font-semibold group-hover:text-primary transition-colors">{report.name}</p>
                      <p className="text-muted-foreground text-sm mt-1">{report.description}</p>
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        {loading ? "Chargement..." : `${total} entrées`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={loading || candidates.length === 0}
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Taux d'approbation global */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/10 via-card to-green-500/10 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Taux de sélection global</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{approvalRate}%</span>
              <span className="text-sm text-muted-foreground">des candidatures approuvées</span>
            </div>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${approvalRate}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
