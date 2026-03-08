"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ADMIN_CODE = "MAGIE2026"

export default function AdminLoginPage() {
  const [code, setCode] = useState("")
  const [showCode, setShowCode] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (code === ADMIN_CODE) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("admin_auth", "true")
      }
      router.push("/admin/dashboard")
    } else {
      setError("Code incorrect. Veuillez r\u00e9essayer.")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/images/logo.jpg"
            alt="La Magie du Soir"
            width={80}
            height={80}
            className="rounded-xl mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground">
            {"Espace Administration"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {"La Magie du Soir 2026"}
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-xl border border-border bg-card p-8"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-6">
            <Lock className="h-7 w-7 text-primary" />
          </div>

          <p className="text-center text-sm text-muted-foreground mb-6">
            {"Entrez le code d'accès administrateur pour continuer."}
          </p>

          <div className="relative mb-4">
            <Input
              type={showCode ? "text" : "password"}
              placeholder="Code d'acc\u00e8s"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError("")
              }}
              className="bg-secondary/50 border-border h-12 pr-12 text-center text-lg tracking-widest"
            />
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showCode ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {error && (
            <p className="text-destructive text-sm text-center mb-4">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold"
          >
            {"Acc\u00e9der au tableau de bord"}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-6">
            {"Contactez le fondateur si vous n'avez pas le code."}
          </p>
        </form>
      </div>
    </div>
  )
}
