"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, User, Palette, Music, Drama, Mic, Megaphone, Phone, Mail, Upload, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CATEGORIES = [
  { id: "styliste", label: "Styliste", icon: User },
  { id: "artiste", label: "Artiste", icon: Palette },
  { id: "danse", label: "Danse", icon: Music },
  { id: "theatre", label: "Th\u00e9\u00e2tre", icon: Drama },
  { id: "chanteur", label: "Chanteur", icon: Mic },
  { id: "slammer", label: "Slammer", icon: Megaphone },
]

const STEPS = [
  { num: 1, label: "Cat\u00e9gorie" },
  { num: 2, label: "Identification" },
  { num: 3, label: "Profil" },
  { num: 4, label: "M\u00e9dias" },
  { num: 5, label: "Engagements" },
]

const COUNTRIES = [
  "Bénin", "Togo", "Cote d'Ivoire", "Sénégal", "Burkina Faso",
  "Mali", "Niger", "Guinée", "Cameroun", "Gabon", "Congo",
  "Ghana", "Nigeria", "France", "Autre"
]

export default function CastingPage() {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState("")
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    sexe: "",
    dateNaissance: "",
    nationalite: "",
    ville: "",
    telephone: "",
    email: "",
    experience: "",
    motivation: "",
    lienVideo: "",
    photo: null as File | null,
    acceptConditions: false,
    acceptPaiement: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const progressValue = (step / 5) * 100

  const updateField = (field: string, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const canGoNext = () => {
    switch (step) {
      case 1:
        return category !== ""
      case 2:
        return (
          formData.nom &&
          formData.prenom &&
          formData.sexe &&
          formData.dateNaissance &&
          formData.nationalite &&
          formData.ville &&
          formData.telephone &&
          formData.email
        )
      case 3:
        return formData.experience && formData.motivation
      case 4:
        return true
      case 5:
        return formData.acceptConditions && formData.acceptPaiement
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // omit photo field entirely to keep payload small
      const { photo, ...rest } = formData
      const payload = { category, ...rest }

      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error?.message || "Erreur lors de l'envoi de votre candidature")
        setLoading(false)
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError("Erreur réseau. Veuillez réessayer.")
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <CastingNav />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-lg w-full text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {"Inscription envoyée !"}
            </h1>
            <p className="text-muted-foreground mb-2">
              {"Merci pour votre candidature au casting La Magie du Soir 2026."}
            </p>
            <p className="text-muted-foreground mb-8">
              {"Vous recevrez un email de confirmation sous 48h. Pour toute question :"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+22901975096422">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  +229 01 97 50 96 42
                </Button>
              </a>
              <Link href="/">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {"Retour à l'accueil"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CastingNav />

      <div className="flex-1 w-full max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {"Casting officiel \u2013 La Magie du Soir 2026"}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {"Vous avez un talent artistique ? Inscrivez-vous dès maintenant pour rejoindre l'aventure."}
            </p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <span className="text-primary text-2xl font-bold">{step}/5</span>
            <p className="text-muted-foreground text-xs uppercase tracking-wider">
              {"Etapes"}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progressValue} className="mb-4 h-2" />

        {/* Step breadcrumb */}
        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-8 text-sm">
          {STEPS.map((s, i) => (
            <span key={s.num} className="flex items-center gap-1">
              <span
                className={
                  s.num <= step
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }
              >
                {s.num}. {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="text-muted-foreground mx-1">{">"}</span>
              )}
            </span>
          ))}
        </div>

        {/* Step Content */}
        <div className="flex flex-col gap-6">
          {/* Step 1: Category */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <h2 className="text-lg font-semibold text-foreground">
                  {"Choix de la catégorie"}
                </h2>
              </div>
              {step > 1 && (
                <button
                  onClick={() => setStep(1)}
                  className="text-primary text-sm hover:underline"
                >
                  Modifier
                </button>
              )}
            </div>

            {step === 1 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon
                  const isSelected = category === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs font-medium uppercase tracking-wide">
                        {cat.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-primary font-medium capitalize">{category}</p>
            )}
          </div>

          {/* Step 2: Identification */}
          {step >= 2 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <h2 className="text-lg font-semibold text-foreground">
                    {"Informations d'identification"}
                  </h2>
                </div>
                {step > 2 && (
                  <button
                    onClick={() => setStep(2)}
                    className="text-primary text-sm hover:underline"
                  >
                    Modifier
                  </button>
                )}
              </div>

              {step === 2 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {"Nom"} <span className="text-primary">*</span>
                    </label>
                    <Input
                      placeholder="Entrez votre nom"
                      value={formData.nom}
                      onChange={(e) => updateField("nom", e.target.value)}
                      className="bg-secondary/50 border-border h-11"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {"Prénoms"} <span className="text-primary">*</span>
                    </label>
                    <Input
                      placeholder="Entrez vos prénoms"
                      value={formData.prenom}
                      onChange={(e) => updateField("prenom", e.target.value)}
                      className="bg-secondary/50 border-border h-11"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {"Sexe"} <span className="text-primary">*</span>
                    </label>
                    <div className="flex gap-3">
                      {["Homme", "Femme", "Autre"].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateField("sexe", s)}
                          className={`flex-1 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                            formData.sexe === s
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {"Date de Naissance"} <span className="text-primary">*</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.dateNaissance}
                      onChange={(e) =>
                        updateField("dateNaissance", e.target.value)
                      }
                      className="bg-secondary/50 border-border h-11"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {"Nationalité"} <span className="text-primary">*</span>
                    </label>
                    <Select
                      value={formData.nationalite}
                      onValueChange={(v) => updateField("nationalite", v)}
                    >
                      <SelectTrigger className="w-full bg-secondary/50 border-border h-11">
                        <SelectValue placeholder="Sélectionnez votre pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {"Ville de résidence"} <span className="text-primary">*</span>
                    </label>
                    <Input
                      placeholder="Ex: Cotonou"
                      value={formData.ville}
                      onChange={(e) => updateField("ville", e.target.value)}
                      className="bg-secondary/50 border-border h-11"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {"Téléphone"} <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="+229 XX XX XX XX"
                        value={formData.telephone}
                        onChange={(e) => updateField("telephone", e.target.value)}
                        className="bg-secondary/50 border-border h-11 pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Email <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="bg-secondary/50 border-border h-11 pl-10"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-foreground">
                  {formData.prenom} {formData.nom} &mdash; {formData.email}
                </p>
              )}
            </div>
          )}

          {/* Step 3: Profil Artistique */}
          {step >= 3 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <h2 className="text-lg font-semibold text-foreground">
                    Profil artistique
                  </h2>
                </div>
                {step > 3 && (
                  <button
                    onClick={() => setStep(3)}
                    className="text-primary text-sm hover:underline"
                  >
                    Modifier
                  </button>
                )}
              </div>

              {step === 3 ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {"Expérience artistique"} <span className="text-primary">*</span>
                    </label>
                    <Textarea
                      placeholder="D\u00e9crivez votre parcours et vos exp\u00e9riences artistiques..."
                      value={formData.experience}
                      onChange={(e) =>
                        updateField("experience", e.target.value)
                      }
                      className="bg-secondary/50 border-border min-h-28"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {"Motivation"} <span className="text-primary">*</span>
                    </label>
                    <Textarea
                      placeholder="Pourquoi souhaitez-vous participer \u00e0 La Magie du Soir ?"
                      value={formData.motivation}
                      onChange={(e) =>
                        updateField("motivation", e.target.value)
                      }
                      className="bg-secondary/50 border-border min-h-28"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-foreground line-clamp-2">
                  {formData.experience.substring(0, 100)}...
                </p>
              )}
            </div>
          )}

          {/* Step 4: Medias */}
          {step >= 4 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <h2 className="text-lg font-semibold text-foreground">
                    {"Médias"}
                  </h2>
                </div>
                {step > 4 && (
                  <button
                    onClick={() => setStep(4)}
                    className="text-primary text-sm hover:underline"
                  >
                    Modifier
                  </button>
                )}
              </div>

              {step === 4 ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {"Photo de profil"}
                    </label>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {"Glissez votre photo ici ou"}
                      </p>
                      <label className="cursor-pointer">
                        <span className="text-primary text-sm font-medium hover:underline">
                          parcourir
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            updateField("photo", file)
                          }}
                        />
                      </label>
                      {formData.photo && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                          {formData.photo.name}
                          <button onClick={() => updateField("photo", null)}>
                            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {"Lien vidéo (YouTube, TikTok, etc.)"}
                    </label>
                    <Input
                      placeholder="https://..."
                      value={formData.lienVideo}
                      onChange={(e) =>
                        updateField("lienVideo", e.target.value)
                      }
                      className="bg-secondary/50 border-border h-11"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {"Partagez un lien vers une vidéo de votre performance"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-foreground">
                  {formData.photo ? formData.photo.name : "Aucune photo"}{" "}
                  {formData.lienVideo && `\u2022 ${formData.lienVideo}`}
                </p>
              )}
            </div>
          )}

          {/* Step 5: Engagements */}
          {step >= 5 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  5
                </span>
                <h2 className="text-lg font-semibold text-foreground">
                  Engagements
                </h2>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-lg border border-border bg-secondary/30 p-4">
                  <h3 className="text-foreground font-medium mb-2">
                    {"Récapitulatif"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">{"Cat\u00e9gorie : "}</span>
                      <span className="text-primary capitalize">{category}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{"Nom : "}</span>
                      <span className="text-foreground">
                        {formData.prenom} {formData.nom}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{"Email : "}</span>
                      <span className="text-foreground">{formData.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{"T\u00e9l\u00e9phone : "}</span>
                      <span className="text-foreground">
                        {formData.telephone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <p className="text-foreground font-semibold text-lg mb-1">
                    {"Frais d'inscription : 5.000 FCFA"}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {"Le paiement sera effectué sur place le jour du casting."}
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptConditions}
                    onChange={(e) =>
                      updateField("acceptConditions", e.target.checked)
                    }
                    className="mt-1 accent-[#d4a017] h-4 w-4"
                  />
                  <span className="text-sm text-muted-foreground">
                    {"J'accepte les conditions de participation et je certifie que les informations fournies sont exactes."}{" "}
                    <span className="text-primary">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptPaiement}
                    onChange={(e) =>
                      updateField("acceptPaiement", e.target.checked)
                    }
                    className="mt-1 accent-[#d4a017] h-4 w-4"
                  />
                  <span className="text-sm text-muted-foreground">
                    {"Je m'engage à régler les frais d'inscription de 5.000 FCFA le jour du casting."}{" "}
                    <span className="text-primary">*</span>
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          {step < 5 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
            >
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canGoNext()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
            >
              {"Envoyer ma candidature"}
              <CheckCircle2 className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Help text */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          {"Besoin d'aide ? Contactez notre équipe de casting "}
          <a
            href="mailto:casting@lamagiedusoir.com"
            className="text-primary hover:underline"
          >
            casting@lamagiedusoir.com
          </a>
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">
          {"\u00a9 2026 La Magie du Soir. Tous droits réservs."}
        </p>
      </footer>
    </div>
  )
}

function CastingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt="La Magie du Soir"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-foreground font-bold text-sm">
            La Magie du Soir{" "}
            <span className="text-primary">2026</span>
          </span>
        </Link>
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full border border-border">
            <User className="h-4 w-4" />
            <span className="sr-only">Admin</span>
          </Button>
        </Link>
      </div>
    </nav>
  )
}
