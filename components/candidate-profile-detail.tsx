"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Music,
  Copy,
  Play,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Mail,
  Phone,
  Globe,
  User,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type StatusKey = "nouveau" | "reviewing" | "approved" | "rejected"

type CandidateRecord = {
  id: string
  fields: Record<string, any>
}

type Props = {
  candidate: CandidateRecord
}

const STATUS_META: Record<
  StatusKey,
  { label: string; airtableValue: string; badgeClass: string }
> = {
  nouveau: {
    label: "Nouveau",
    airtableValue: "Nouveau",
    badgeClass:
      "bg-[#e5a83b]/20 text-[#e5a83b] border-[#e5a83b]/30 hover:bg-[#e5a83b]/30",
  },
  reviewing: {
    label: "En revue",
    airtableValue: "En Revue",
    badgeClass:
      "bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20",
  },
  approved: {
    label: "Approuvé",
    airtableValue: "Approuvé",
    badgeClass:
      "bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20",
  },
  rejected: {
    label: "Rejeté",
    airtableValue: "Rejeté",
    badgeClass:
      "bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20",
  },
}

function normalizeStatus(value?: string): StatusKey {
  const raw = String(value || "").trim().toLowerCase()

  if (["approuvé", "approuve", "approved"].includes(raw)) return "approved"
  if (["en revue", "reviewing", "review"].includes(raw)) return "reviewing"
  if (["rejeté", "rejete", "rejected"].includes(raw)) return "rejected"
  return "nouveau"
}

function getInitials(fullName: string) {
  const cleaned = String(fullName || "").trim()
  if (!cleaned) return "NA"
  return cleaned
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

function computeAge(value?: string) {
  if (!value) return null
  const birth = new Date(value)
  if (Number.isNaN(birth.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1
  return age
}

function getFileName(url?: string, fallback = "Document") {
  if (!url || typeof url !== "string") return fallback
  try {
    const pathname = new URL(url).pathname
    const name = pathname.split("/").pop()
    return decodeURIComponent(name || fallback)
  } catch {
    const parts = url.split("/")
    return decodeURIComponent(parts[parts.length - 1] || fallback)
  }
}

export function CandidateProfileDetail({ candidate }: Props) {
  const [status, setStatus] = useState<StatusKey>(
    normalizeStatus(candidate.fields?.Statut)
  )
  const [saving, setSaving] = useState(false)

  const data = useMemo(() => {
    const fields = candidate.fields || {}
    const nom = fields.Nom || ""
    const prenoms = fields["Prénoms"] || fields.Prenoms || ""
    const fullName = `${nom} ${prenoms}`.trim() || "Sans nom"
    const email = fields.Email || "-"
    const phone = fields["Téléphone"] || fields.Telephone || "-"
    const city = fields.Ville || "-"
    const country = fields.Nationalité || "-"
    const birthDate = fields["Date de Naissance"] || ""
    const age = computeAge(birthDate)
    const submittedAt =
      fields["Date de Soumission"] ||
      fields["Date de création"] ||
      fields["Created Time"] ||
      fields.createdTime ||
      ""
    const category = fields["Catégorie"] || fields.Categorie || "-"
    const experience = fields["Expérience"] || fields.Experience || "-"
    const motivation = fields.Motivation || "-"
    const videoUrl = fields["Lien Vidéo"] || fields["Lien Video"] || ""
    const sexe = fields.Sexe || "-"
    const cvUrl = fields["CV"] || fields["Lien CV"] || fields.cv || ""
    const photoUrl =
      fields["Photo"] || fields["Photo identité"] || fields["Photo Identité"] || ""

    return {
      fullName,
      initials: getInitials(fullName),
      email,
      phone,
      city,
      country,
      birthDate,
      age,
      submittedAt,
      category,
      experience,
      motivation,
      videoUrl,
      sexe,
      cvUrl,
      photoUrl,
    }
  }, [candidate])

  const currentMeta = STATUS_META[status]

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch (error) {
      console.error("Erreur copie:", error)
    }
  }

  const handleStatusChange = async (nextStatus: StatusKey) => {
    try {
      setSaving(true)

      const res = await fetch(`/api/candidates/${candidate.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statut: STATUS_META[nextStatus].airtableValue,
        }),
      })

      const payload = await res.json()

      if (!res.ok) {
        throw new Error(payload?.error || "Échec de mise à jour du statut")
      }

      setStatus(nextStatus)
    } catch (error) {
      console.error("Erreur changement statut:", error)
      alert("Le statut n'a pas pu être mis à jour.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex-1 p-6 overflow-auto bg-background min-h-screen">
      <Link
        href="/admin/dashboard/candidates"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Retour aux candidats</span>
      </Link>

      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6 mb-8">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 bg-[#e5a83b]">
            <AvatarFallback className="bg-[#e5a83b] text-black font-bold text-xl">
              {data.initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{data.fullName}</h1>
              <Badge className={currentMeta.badgeClass}>{currentMeta.label}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Music className="w-4 h-4 text-[#e5a83b]" />
                {data.category}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#e5a83b]" />
                {data.city}, {data.country}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Soumis le {formatDate(data.submittedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Statut</span>
            <Select value={status} onValueChange={(value) => handleStatusChange(value as StatusKey)}>
              <SelectTrigger className="w-36 bg-[#1a1a1a] border-border text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-border text-white">
                <SelectItem value="nouveau">Nouveau</SelectItem>
                <SelectItem value="reviewing">En revue</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            disabled={saving}
            onClick={() => handleStatusChange("approved")}
            className="bg-[#e5a83b] hover:bg-[#d4992f] text-black font-semibold"
          >
            Approuver
          </Button>
          <Button
            disabled={saving}
            variant="outline"
            onClick={() => handleStatusChange("rejected")}
            className="border-border text-white hover:bg-[#1a1a1a]"
          >
            Rejeter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-[#151515] border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white text-base">
                <User className="w-4 h-4 text-[#e5a83b]" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white text-sm break-all">{data.email}</span>
                    {data.email !== "-" && (
                      <button
                        type="button"
                        onClick={() => handleCopy(data.email)}
                        className="p-1 hover:bg-[#1a1a1a] rounded transition-colors"
                      >
                        <Copy className="w-3 h-3 text-[#e5a83b]" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Téléphone</label>
                  <div className="mt-1 flex items-center gap-2 text-white text-sm">
                    <Phone className="w-4 h-4 text-[#e5a83b]" />
                    <span>{data.phone}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Ville</label>
                  <div className="mt-1 flex items-center gap-2 text-white text-sm">
                    <MapPin className="w-4 h-4 text-[#e5a83b]" />
                    <span>{data.city}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Nationalité</label>
                  <div className="mt-1 flex items-center gap-2 text-white text-sm">
                    <Globe className="w-4 h-4 text-[#e5a83b]" />
                    <span>{data.country}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Date de Naissance</label>
                  <div className="mt-1 text-white text-sm">
                    {data.birthDate ? `${formatDate(data.birthDate)}${data.age ? ` (${data.age} ans)` : ""}` : "-"}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Genre</label>
                  <div className="mt-1 text-white text-sm">{data.sexe}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#151515] border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white text-base">
                <span className="text-[#e5a83b]">📝</span>
                Détails de la candidature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Catégorie</label>
                  <div className="mt-2">
                    <Badge className="bg-[#e5a83b]/20 text-[#e5a83b] border-[#e5a83b]/30">
                      {data.category}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Expérience</label>
                  <div className="mt-1">
                    <span className="text-white text-sm">{data.experience}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Motivation</label>
                <p className="text-white text-sm mt-2 leading-relaxed whitespace-pre-wrap">
                  {data.motivation}
                </p>
              </div>

              {data.videoUrl && (
                <a
                  href={data.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[#e5a83b] text-sm hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Lien vers la performance complète
                </a>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#151515] border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white text-base">
                <span className="text-[#e5a83b]">🎬</span>
                Vidéo de présentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-3 border border-border">
                {data.videoUrl ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a
                      href={data.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-14 h-14 rounded-full bg-[#e5a83b] flex items-center justify-center hover:bg-[#d4992f] transition-colors"
                    >
                      <Play className="w-6 h-6 text-black ml-1" fill="black" />
                    </a>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                    Aucune vidéo fournie
                  </div>
                )}
              </div>

              {data.videoUrl && (
                <a
                  href={data.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[#e5a83b] text-xs hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Ouvrir dans un nouvel onglet
                </a>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#151515] border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white text-base">
                <span className="text-[#e5a83b]">📎</span>
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded bg-[#2a2a2a] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#e5a83b]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {data.cvUrl ? getFileName(data.cvUrl, "CV") : "Aucun CV"}
                    </p>
                    <p className="text-muted-foreground text-xs">Document</p>
                  </div>
                </div>
                {data.cvUrl ? (
                  <a
                    href={data.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 hover:bg-[#2a2a2a] rounded transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                ) : null}
              </div>

              <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded bg-[#2a2a2a] flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5 text-[#e5a83b]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {data.photoUrl ? getFileName(data.photoUrl, "Photo") : "Aucune photo"}
                    </p>
                    <p className="text-muted-foreground text-xs">Image</p>
                  </div>
                </div>
                {data.photoUrl ? (
                  <a
                    href={data.photoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 hover:bg-[#2a2a2a] rounded transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#151515] border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white text-base">
                <Mail className="w-4 h-4 text-[#e5a83b]" />
                Contact rapide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href={data.email !== "-" ? `mailto:${data.email}` : "#"}
                className="block"
              >
                <Button className="w-full bg-[#e5a83b] hover:bg-[#d4992f] text-black font-semibold">
                  Envoyer un email
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
