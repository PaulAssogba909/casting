"use client"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Search, Filter, MoreVertical, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type RawCandidate = {
  id: string
  fields: Record<string, any>
}

type CandidateStatus = "nouveau" | "reviewing" | "approved" | "rejected"

type Candidate = {
  id: string
  initials: string
  name: string
  email: string
  category: string
  date: string
  status: CandidateStatus
  city: string
  phone: string
  rawFields: Record<string, any>
}

const STATUS_MAP: Record<
  CandidateStatus,
  { label: string; className: string; airtableValue: string }
> = {
  nouveau: {
    label: "NOUVEAU",
    airtableValue: "Nouveau",
    className: "bg-blue-500/10 text-blue-500 border border-blue-500/30",
  },
  reviewing: {
    label: "EN REVUE",
    airtableValue: "En Revue",
    className: "bg-primary/10 text-primary border border-primary/30",
  },
  approved: {
    label: "APPROUVÉ",
    airtableValue: "Approuvé",
    className: "bg-green-500/10 text-green-500 border border-green-500/30",
  },
  rejected: {
    label: "REJETÉ",
    airtableValue: "Rejeté",
    className: "bg-destructive/10 text-destructive border border-destructive/30",
  },
}

function normalizeStatus(value?: string): CandidateStatus {
  const raw = (value || "").trim().toLowerCase()

  if (raw === "approuvé" || raw === "approuve" || raw === "approved") {
    return "approved"
  }

  if (raw === "en revue" || raw === "reviewing" || raw === "review") {
    return "reviewing"
  }

  if (raw === "rejeté" || raw === "rejete" || raw === "rejected") {
    return "rejected"
  }

  return "nouveau"
}

function getInitials(name: string) {
  if (!name) return "NA"

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("")
}

function formatDate(value?: string) {
  if (!value) return "-"

  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)
}

function formatCandidate(item: RawCandidate): Candidate {
  const fields = item.fields || {}

  const nom = fields.Nom || ""
  const prenoms = fields["Prénoms"] || fields.Prenoms || ""
  const name = `${nom} ${prenoms}`.trim() || "Sans nom"

  return {
    id: item.id,
    initials: getInitials(name),
    name,
    email: fields.Email || "-",
    category: fields["Catégorie"] || fields.Categorie || "-",
    date: formatDate(
      fields["Date de création"] ||
        fields["Created Time"] ||
        fields.createdTime ||
        ""
    ),
    status: normalizeStatus(fields.Statut),
    city: fields.Ville || "-",
    phone: fields["Téléphone"] || fields.Telephone || "-",
    rawFields: fields,
  }
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true)

        const res = await fetch("/api/candidates", { cache: "no-store" })
        const data = await res.json()

        const records = Array.isArray(data) ? data : []
        setCandidates(records.map(formatCandidate))
      } catch (error) {
        console.error("Erreur lors du chargement des candidats :", error)
        setCandidates([])
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [])

  const categories = useMemo(() => {
    return Array.from(
      new Set(candidates.map((c) => c.category).filter((v) => v && v !== "-"))
    ).sort((a, b) => a.localeCompare(b))
  }, [candidates])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return candidates.filter((c) => {
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)

      const matchStatus =
        filterStatus === "all" || c.status === filterStatus

      const matchCategory =
        filterCategory === "all" || c.category === filterCategory

      return matchSearch && matchStatus && matchCategory
    })
  }, [candidates, search, filterStatus, filterCategory])

 const updateStatus = async (id: string, status: CandidateStatus) => {
  try {
    const res = await fetch(`/api/candidates/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        statut:
          status === "nouveau"
            ? "Nouveau"
            : status === "reviewing"
              ? "En Revue"
              : status === "approved"
                ? "Approuvé"
                : "Rejeté",
      }),
    })

    const text = await res.text()
    console.log("PATCH raw response:", text)

    let data: any = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      throw new Error(`Réponse non JSON reçue: ${text.slice(0, 200)}`)
    }

    if (!res.ok) {
      throw new Error(data?.error || "Échec de mise à jour du statut")
    }

    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    )
  } catch (error) {
    console.error("Erreur updateStatus:", error)
  }
}

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Candidats</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez toutes les candidatures reçues
          </p>
        </div>

        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un candidat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-secondary/50 border-border h-10 pl-10"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-auto bg-secondary/50 border-border h-10">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Toutes catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-auto bg-secondary/50 border-border h-10">
            <SelectValue placeholder="Tous statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="nouveau">Nouveau</SelectItem>
            <SelectItem value="reviewing">En revue</SelectItem>
            <SelectItem value="approved">Approuvé</SelectItem>
            <SelectItem value="rejected">Rejeté</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        {loading
          ? "Chargement des candidats..."
          : `${filtered.length} candidat${filtered.length > 1 ? "s" : ""} trouvé${filtered.length > 1 ? "s" : ""}`}
      </p>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left text-xs uppercase tracking-wider text-primary font-semibold p-4">
                  Candidat
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-primary font-semibold p-4">
                  Catégorie
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-primary font-semibold p-4">
                  Ville
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-primary font-semibold p-4">
                  Date
                </th>
                <th className="text-left text-xs uppercase tracking-wider text-primary font-semibold p-4">
                  Statut
                </th>
                <th className="text-right text-xs uppercase tracking-wider text-primary font-semibold p-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => {
                const badge = STATUS_MAP[c.status]

                return (
                  <tr
                    key={c.id}
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <span className="text-primary text-sm font-bold">
                            {c.initials}
                          </span>
                        </div>
                        <div>
                          <p className="text-foreground font-medium text-sm">
                            {c.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {c.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-sm text-foreground">{c.category}</td>
                    <td className="p-4 text-sm text-muted-foreground">{c.city}</td>
                    <td className="p-4 text-sm text-muted-foreground">{c.date}</td>

                    <td className="p-4">
                      <Select
                        value={c.status}
                        onValueChange={(value) =>
                          updateStatus(c.id, value as CandidateStatus)
                        }
                      >
                        <SelectTrigger className={`w-[140px] ${badge.className}`}>
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

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/admin/dashboard/candidates/${c.id}`)}
                          className="text-muted-foreground hover:text-primary h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground h-8 w-8"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            Aucun candidat trouvé avec ces critères.
          </div>
        )}
      </div>
    </div>
  )
}