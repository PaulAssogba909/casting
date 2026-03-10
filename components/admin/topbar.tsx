"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, Bell, Settings, Menu, X, LayoutDashboard, Users, Tag, CalendarDays, FileText, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminTopbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("admin_auth")
    }
    router.push("/admin")
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <Image
              src="/images/logo.jpg"
              alt="La Magie du Soir"
              width={28}
              height={28}
              className="rounded-md"
            />
          </Link>

          {/* Search */}
          <div className="hidden md:flex relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="bg-secondary/50 border-border h-9 pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Bouton Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <span className="text-sm font-medium">Nouvelle candidature</span>
                  <span className="text-xs text-muted-foreground">Un nouveau candidat vient de soumettre sa candidature.</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <span className="text-sm font-medium">Casting confirmé</span>
                  <span className="text-xs text-muted-foreground">Le casting du 20 Avril 2026 est confirmé.</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-primary text-sm justify-center">
                  Voir toutes les notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bouton Paramètres */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Paramètres</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Paramètres</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
                  Tableau de bord
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/admin/dashboard/candidates")}>
                  Gérer les candidats
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/admin/dashboard/events")}>
                  Gérer les événements
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Avatar admin */}
            <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
              <span className="text-primary text-xs font-bold">AD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
            <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/logo.jpg"
                  alt="La Magie du Soir"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-sidebar-foreground font-bold text-sm">
                  La Magie du Soir <span className="text-sidebar-primary">2026</span>
                </span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="text-sidebar-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
              {[
                { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
                { href: "/admin/dashboard/candidates", label: "Candidats", icon: Users },
                { href: "/admin/dashboard/categories", label: "Cat\u00e9gories", icon: Tag },
                { href: "/admin/dashboard/events", label: "\u00c9v\u00e9nements", icon: CalendarDays },
                { href: "/admin/dashboard/reports", label: "Rapports", icon: FileText },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t border-sidebar-border">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-sidebar-foreground/50 hover:text-destructive transition-colors w-full px-3 py-2"
              >
                <LogOut className="h-4 w-4" />
                {"D\u00e9connexion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
