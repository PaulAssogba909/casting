import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { CandidateProfileDetail } from "@/components/candidate-profile-detail"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function CandidateDetailPage({ params }: PageProps) {
  const { id } = await params

  const h = await headers()
  const host = h.get("x-forwarded-host") || h.get("host")
  const protocol = h.get("x-forwarded-proto") || "https"

  if (!host) {
    notFound()
  }

  const res = await fetch(`${protocol}://${host}/api/candidates/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    notFound()
  }

  const payload = await res.json()
  const candidate = payload?.record || payload

  if (!candidate?.id) {
    notFound()
  }

  return <CandidateProfileDetail candidate={candidate} />
}
