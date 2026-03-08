"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { MoreVertical, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"

type TimeRange = "7d" | "30d" | "90d"
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
    "Date de Naissance"?: string
    "Date de Soumission"?: string
    "Date de création"?: string
    Date?: string
    Created?: string
    createdTime?: string
    [key: string]: any
  }
}

const STATUS_META: Record<
  StatusKey,
  { label: string; airtableValue: string; color: string; className: string }
> = {
  nouveau: {
    label: "NOUVEAU",
    airtableValue: "Nouveau",
    color: "#d4a017",
    className: "bg-primary/10 text-primary border border-primary/30",
  },
  reviewing: {
    label: "EN REVUE",
    airtableValue: "En Revue",
    color: "#a0946e",
    className: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30",
  },
  approved: {
    label: "APPROUVÉ",
    airtableValue: "Approuvé",
    color: "#16a34a",
    className: "bg-green-500/10 text-green-500 border border-green-500/30",
  },
  rejected: {
    label: "REJETÉ",
    airtableValue: "Rejeté",
    color: "#b91c1c",
    className:
      "bg-destructive/10 text-destructive border border-destructive/30",
  },
}

function normalizeStatus(value?: string): StatusKey {
  const raw = (value || "").trim().toLowerCase()

  if (
    raw === "approved" ||
    raw === "approuvé" ||
    raw === "approuve" ||
    raw === "validé" ||
    raw === "valide"
  ) {
    return "approved"
  }

  if (
    raw === "reviewing" ||
    raw === "en revue" ||
    raw === "review" ||
    raw === "en cours" ||
    raw === "à revoir" ||
    raw === "a revoir"
  ) {
    return "reviewing"
  }

  if (
    raw === "rejected" ||
    raw === "rejeté" ||
    raw === "rejete" ||
    raw === "refusé" ||
    raw === "refuse"
  ) {
    return "rejected"
  }

  return "nouveau"
}

function getInitials(name?: string) {
  if (!name) return "NA"

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("")
}

function getSubmissionDate(fields: Candidate["fields"]): Date | null {
  const raw =
    fields["Date de Soumission"] ||
    fields["Date de création"] ||
    fields.Date ||
    fields.Created ||
    fields.createdTime

  if (!raw) return null

  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDate(date: Date | null) {
  if (!date) return "-"

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

function buildTrendData(candidates: Candidate[], range: TimeRange) {
  const now = new Date()

  if (range === "7d") {
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(now)
      day.setDate(now.getDate() - (6 - index))

      const start = startOfDay(day)
      const end = endOfDay(day)

      const submissions = candidates.filter((candidate) => {
        const date = getSubmissionDate(candidate.fields)
        return date && date >= start && date <= end
      }).length

      return {
        label: new Intl.DateTimeFormat("fr-FR", {
          day: "2-digit",
          month: "2-digit",
        }).format(day),
        submissions,
      }
    })
  }

  if (range === "30d") {
    const buckets = [
      { label: "Sem 1", startDay: 22, endDay: 29 },
      { label: "Sem 2", startDay: 15, endDay: 21 },
      { label: "Sem 3", startDay: 8, endDay: 14 },
      { label: "Sem 4", startDay: 0, endDay: 7 },
    ]

    return buckets.map((bucket) => {
      const start = startOfDay(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - bucket.startDay)
      )
      const end = endOfDay(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - bucket.endDay)
      )

      const submissions = candidates.filter((candidate) => {
        const date = getSubmissionDate(candidate.fields)
        return date && date >= start && date <= end
      }).length

      return {
        label: bucket.label,
        submissions,
      }
    })
  }

  return [2, 1, 0].map((offset) => {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    )

    const submissions = candidates.filter((candidate) => {
      const candidateDate = getSubmissionDate(candidate.fields)
      return candidateDate && candidateDate >= start && candidateDate <= end
    }).length

    return {
      label: new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(date),
      submissions,
    }
  })
}

export default function DashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const [loading, setLoading] = useState(true)

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/candidates", {
        cache: "no-store",
      })

      const data = await res.json()

      const records = Array.isArray(data)
        ? data
        : Array.isArray(data?.records)
          ? data.records
          : []

      setCandidates(records)
    } catch (error) {
      console.error("Erreur chargement dashboard:", error)
      setCandidates([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  const normalizedCandidates = useMemo(() => {
    return candidates.map((candidate) => {
      const statusKey = normalizeStatus(candidate.fields.Statut)
      const submissionDate = getSubmissionDate(candidate.fields)
      const firstName = candidate.fields["Prénoms"] || ""
      const baseName = candidate.fields.Nom || "Sans nom"
      const name = `${baseName} ${firstName}`.trim()

      return {
        id: candidate.id,
        name,
        email: candidate.fields.Email || "-",
        category: candidate.fields.Catégorie || candidate.fields.Categorie || "-",
        statusKey,
        statusLabel: STATUS_META[statusKey].label,
        statusClassName: STATUS_META[statusKey].className,
        initials: getInitials(name),
        submissionDate,
        submissionDateLabel: formatDate(submissionDate),
      }
    })
  }, [candidates])

  const total = normalizedCandidates.length
  const reviewing = normalizedCandidates.filter(
    (c) => c.statusKey === "reviewing"
  ).length
  const approved = normalizedCandidates.filter(
    (c) => c.statusKey === "approved"
  ).length
  const successRate = total ? Math.round((approved / total) * 100) : 0

  const stats = [
    { title: "Total Candidats", value: total },
    { title: "En Revue", value: reviewing },
    { title: "Approuvés", value: approved },
    { title: "Taux de réussite", value: `${successRate}%` },
  ]

  const statusData = useMemo(() => {
    const counts: Record<StatusKey, number> = {
      nouveau: 0,
      reviewing: 0,
      approved: 0,
      rejected: 0,
    }

    normalizedCandidates.forEach((candidate) => {
      counts[candidate.statusKey] += 1
    })

    return (Object.keys(STATUS_META) as StatusKey[]).map((key) => ({
      name: STATUS_META[key].label,
      value: counts[key],
      color: STATUS_META[key].color,
    }))
  }, [normalizedCandidates])

  const trendData = useMemo(() => {
    return buildTrendData(candidates, timeRange)
  }, [candidates, timeRange])

  const updateStatus = async (id: string, status: StatusKey) => {
    try {
      const res = await fetch(`/api/candidates/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statut: STATUS_META[status].airtableValue,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Échec de mise à jour du statut")
      }

      await fetchCandidates()
    } catch (error) {
      console.error("Erreur de mise à jour du statut :", error)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gérez les soumissions et les performances pour l&apos;édition 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-border bg-card p-5"
          >
            <p className="text-sm text-primary font-medium mb-2">{stat.title}</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-foreground">
                {loading ? "..." : stat.value}
              </span>

              {stat.title === "Taux de réussite" ? (
                <div className="flex items-center gap-1 text-sm text-green-500">
                  <TrendingUp className="h-4 w-4" />
                  {loading ? "..." : stat.value}
                </div>
              ) : (
                <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${
                        total
                          ? Math.min((Number(stat.value) / total) * 100, 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Répartition des Statuts
            </h2>
            <button className="text-primary text-sm hover:underline">
              Voir détails
            </button>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1610",
                    border: "1px solid #3d3425",
                    borderRadius: "8px",
                    color: "#f5f0e8",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {statusData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <span
                  className="w-3 h-1 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground uppercase tracking-wider">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Tendance des Soumissions
            </h2>

            <Select
              value={timeRange}
              onValueChange={(value: TimeRange) => setTimeRange(value)}
            >
              <SelectTrigger className="w-auto bg-secondary/50 border-border text-sm h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 derniers jours</SelectItem>
                <SelectItem value="30d">30 derniers jours</SelectItem>
                <SelectItem value="90d">90 derniers jours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a017" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d4a017" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#3d3425" />

                <XAxis
                  dataKey="label"
                  tick={{ fill: "#a0946e", fontSize: 12 }}
                  axisLine={{ stroke: "#3d3425" }}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
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

                <Area
                  type="monotone"
                  dataKey="submissions"
                  stroke="#d4a017"
                  strokeWidth={2}
                  fill="url(#goldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Candidats Récents
          </h2>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs uppercase tracking-wider text-primary font-semibold pb-3 pr-4">
                  Candidat
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-primary font-semibold pb-3 pr-4">
                  Catégorie
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-primary font-semibold pb-3 pr-4">
                  Date de Soumission
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-primary font-semibold pb-3 pr-4">
                  Statut
                </th>
                <th className="text-right text-xs uppercase tracking-wider text-primary font-semibold pb-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {normalizedCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <span className="text-primary text-sm font-bold">
                          {candidate.initials}
                        </span>
                      </div>
                      <div>
                        <p className="text-foreground font-medium text-sm">
                          {candidate.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {candidate.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 pr-4 text-sm text-foreground">
                    {candidate.category}
                  </td>

                  <td className="py-4 pr-4 text-sm text-muted-foreground">
                    {candidate.submissionDateLabel}
                  </td>

                  <td className="py-4 pr-4">
                    <Select
                      value={candidate.statusKey}
                      onValueChange={(value: StatusKey) =>
                        updateStatus(candidate.id, value)
                      }
                    >
                      <SelectTrigger
                        className={`px-3 py-1 rounded-full text-xs font-medium ${candidate.statusClassName}`}
                      >
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="nouveau">Nouveau</SelectItem>
                        <SelectItem value="reviewing">En revue</SelectItem>
                        <SelectItem value="approved">Approuvé</SelectItem>
                        <SelectItem value="rejected">Rejeté</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  <td className="py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden flex flex-col gap-4">
          {normalizedCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="rounded-lg border border-border/50 bg-secondary/30 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-primary text-sm font-bold">
                      {candidate.initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">
                      {candidate.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {candidate.email}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{candidate.category}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${candidate.statusClassName}`}
                >
                  {candidate.statusLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Chargement..."
              : `Affichage de ${normalizedCandidates.length} entrée(s)`}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground"
            >
              Précédent
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}