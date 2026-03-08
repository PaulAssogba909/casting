import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Candidats`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    console.log("[api/candidates/fetch] response status:", response.status);
    console.log("[api/candidates/fetch] records count:", data.records?.length || 0);

    if (!response.ok) {
      console.error("[api/candidates/fetch] error:", data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data.records || []);
  } catch (error) {
    console.error("[api/candidates/fetch] catch error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la lecture des candidats" },
      { status: 500 }
    );
  }
}
