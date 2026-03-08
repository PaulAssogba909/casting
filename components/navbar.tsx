"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt="La Magie du Soir"
            width={44}
            height={44}
            className="rounded-lg"
          />
          <span className="text-foreground font-bold text-sm uppercase tracking-wider hidden sm:block">
            La Magie du Soir
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#categories" className="text-muted-foreground hover:text-primary text-sm transition-colors">
            {"Cat\u00e9gories"}
          </Link>
          <Link href="#criteres" className="text-muted-foreground hover:text-primary text-sm transition-colors">
            {"Crit\u00e8res"}
          </Link>
          <Link href="#dates" className="text-muted-foreground hover:text-primary text-sm transition-colors">
            Dates
          </Link>
          <Link href="#contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <a href="tel:+22901975096422" className="hidden sm:flex">
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </Button>
          </a>
          <Link href="/casting">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              {"S'inscrire"}
            </Button>
          </Link>
          <Link href="/admin" className="hidden md:block">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary text-xs">
              Admin
            </Button>
          </Link>
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 py-4 flex flex-col gap-4">
          <Link href="#categories" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-primary text-sm">
            {"Cat\u00e9gories"}
          </Link>
          <Link href="#criteres" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-primary text-sm">
            {"Crit\u00e8res"}
          </Link>
          <Link href="#dates" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-primary text-sm">
            Dates
          </Link>
          <Link href="#contact" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-primary text-sm">
            Contact
          </Link>
          <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-primary text-sm">
            Admin
          </Link>
          <a href="tel:+22901975096422" className="flex items-center gap-2 text-primary text-sm">
            <Phone className="h-4 w-4" />
            Appeler pour plus d{"'"}info
          </a>
        </div>
      )}
    </nav>
  )
}
