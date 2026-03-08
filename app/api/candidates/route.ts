import { NextRequest, NextResponse } from "next/server"
import { sendCandidateSubmissionEmail } from "@/lib/email"

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const TABLE_NAME = "Candidats"


function mapCategoryToAirtable(value?: string) {
  const raw = (value || "").trim().toLowerCase()

  if (raw === "styliste") return "Styliste"
  if (raw === "artiste") return "Artiste"
  if (raw === "danse") return "Danse"
  if (raw === "theatre" || raw === "théâtre") return "Théâtre"
  if (raw === "chanteur") return "Chanteur"
  if (raw === "slammer") return "Slammer"

  return ""
}
function getHeaders() {
  return {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  }
}

export async function GET() {
  try {
    if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
      return NextResponse.json(
        { error: "Variables d'environnement Airtable manquantes" },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
        cache: "no-store",
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || "Erreur Airtable" },
        { status: response.status }
      )
    }

    return NextResponse.json(data.records || [])
  } catch (error) {
    console.error("[api/candidates][GET] server error", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
      return NextResponse.json(
        { error: "Variables d'environnement Airtable manquantes" },
        { status: 500 }
      )
    }

    const body = await request.json()

    if (!body.nom || !body.prenom || !body.email) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      )
    }

    const fields = {
    Catégorie: mapCategoryToAirtable(body.category),
      Nom: body.nom,
      Prénoms: body.prenom,
      Sexe: body.sexe || "",
      "Date de Naissance": body.dateNaissance || "",
      Nationalité: body.nationalite || "",
      Ville: body.ville || "",
      Téléphone: body.telephone || "",
      Email: body.email,
      Expérience: body.experience || "",
      Motivation: body.motivation || "",
      "Lien Vidéo": body.lienVideo || "",
      "Accepte Conditions": Boolean(body.acceptConditions),
      "Accepte Paiement": Boolean(body.acceptPaiement),
      Statut: "Nouveau",
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          records: [{ fields }],
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || data || "Erreur Airtable" },
        { status: response.status }
      )
    }

    const createdRecord = data.records?.[0] || null
    const createdFields = createdRecord?.fields || {}

    const candidateName =
      `${createdFields.Nom || body.nom || ""} ${createdFields["Prénoms"] || body.prenom || ""}`.trim() ||
      "Candidat"

    const candidateEmail = createdFields.Email || body.email || ""
    const candidateCategory = createdFields["Catégorie"] || fields.Catégorie || ""

    let emailSent = false
    let emailError: string | null = null

    try {
      if (candidateEmail) {
        await sendCandidateSubmissionEmail({
          to: candidateEmail,
          name: candidateName,
          category: candidateCategory,
        })
        emailSent = true
      }
    } catch (err: any) {
      console.error("[api/candidates][POST] email error", err)
      emailError = err?.message || "Impossible d'envoyer l'email de confirmation"
    }

    return NextResponse.json(
      {
        success: true,
        record: createdRecord,
        emailSent,
        emailError,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[api/candidates][POST] server error", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}