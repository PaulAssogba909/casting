import { notFound } from "next/navigation"
import { CandidateProfileDetail } from "@/components/candidate-profile-detail"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function CandidateDetailPage({ params }: PageProps) {
  const { id } = await params

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/candidates/${id}`, {
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
