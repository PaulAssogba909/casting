import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function getFromEmail() {
  return process.env.EMAIL_FROM || "onboarding@resend.dev"
}

function ensureResendConfigured() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY manquante")
  }
}

export async function sendCandidateSubmissionEmail({
  to,
  name,
  category,
}: {
  to: string
  name: string
  category?: string
}) {
  if (!to) return { success: false, reason: "missing_to" }

  ensureResendConfigured()

  const { data, error } = await resend.emails.send({
    from: getFromEmail(),
    to: [to],
    subject: "Confirmation de réception de votre candidature",
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2>Candidature bien reçue</h2>
        <p>Bonjour ${name || "candidat(e)"},</p>
        <p>
          Nous confirmons la bonne réception de votre candidature${
            category ? ` pour la catégorie <strong>${category}</strong>` : ""
          }.
        </p>
        <p>
          Notre équipe étudiera votre dossier et vous serez informé(e) des prochaines étapes.
        </p>
        <p>Merci pour votre intérêt.</p>
      </div>
    `,
  })

  if (error) {
    throw new Error(error.message || "Erreur Resend")
  }

  return { success: true, data }
}

export async function sendCandidateStatusEmail({
  to,
  name,
  status,
}: {
  to: string
  name: string
  status: string
}) {
  if (!to) return { success: false, reason: "missing_to" }

  ensureResendConfigured()

  let message = `Le statut de votre candidature a été mis à jour : ${status}.`

  if (status === "Approuvé") {
    message =
      "Nous avons le plaisir de vous informer que votre candidature a été approuvée."
  } else if (status === "Rejeté") {
    message =
      "Nous vous informons que votre candidature n’a malheureusement pas été retenue."
  } else if (status === "En Revue") {
    message =
      "Votre candidature est actuellement en cours d’examen par notre équipe."
  } else if (status === "Nouveau") {
    message =
      "Votre candidature a bien été enregistrée dans notre système."
  }

  const { data, error } = await resend.emails.send({
    from: getFromEmail(),
    to: [to],
    subject: "Mise à jour de votre candidature",
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2>Mise à jour de votre candidature</h2>
        <p>Bonjour ${name || "candidat(e)"},</p>
        <p>${message}</p>
        <p><strong>Statut actuel :</strong> ${status}</p>
      </div>
    `,
  })

  if (error) {
    throw new Error(error.message || "Erreur Resend")
  }

  return { success: true, data }
}