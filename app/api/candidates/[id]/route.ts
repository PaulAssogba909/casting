import { NextRequest, NextResponse } from "next/server"
import { sendCandidateStatusEmail } from "@/lib/email"

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const TABLE_NAME = "Candidats"

async function getAirtableRecord(id: string) {
  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  )

  const data = await response.json()
  return { response, data }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
      return NextResponse.json(
        { error: "Variables d'environnement Airtable manquantes" },
        { status: 500 }
      )
    }

    const { id } = await context.params
    const { response, data } = await getAirtableRecord(id)

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || data || "Erreur Airtable" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[api/candidates/[id]][GET] error", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
      return NextResponse.json(
        { error: "Variables d'environnement Airtable manquantes" },
        { status: 500 }
      )
    }

    const { id } = await context.params
    const body = await request.json()

    const statut = body.statut || "Nouveau"

    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Statut: statut,
          },
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

    const fields = data?.fields || {}
    const candidateName =
      `${fields.Nom || ""} ${fields["Prénoms"] || ""}`.trim() || "Candidat"
    const candidateEmail = fields.Email || ""

    try {
      if (candidateEmail) {
        await sendCandidateStatusEmail({
          to: candidateEmail,
          name: candidateName,
          status: statut,
        })
      }
    } catch (emailError) {
      console.error("[api/candidates/[id]][PATCH] email error", emailError)
    }

    return NextResponse.json({
      success: true,
      record: data,
    })
  } catch (error) {
    console.error("[api/candidates/[id]][PATCH] error", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}