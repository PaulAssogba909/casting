

"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Tag, CalendarDays, FileText, LogOut } from "lucide-react"

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/candidates", label: "Candidats", icon: Users },
  { href: "/admin/dashboard/categories", label: "Cat\u00e9gories", icon: Tag },
  { href: "/admin/dashboard/events", label: "\u00c9v\u00e9nements", icon: CalendarDays },
  { href: "/admin/dashboard/reports", label: "Rapports", icon: FileText },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("admin_auth")
    }
    router.push("/admin")
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-sidebar border-r border-sidebar-border flex-col z-40 hidden lg:flex">
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt="La Magie du Soir"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-sidebar-foreground font-bold text-sm">
            La Magie du Soir{" "}
            <span className="text-sidebar-primary">2026</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-primary/15 text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-lg bg-sidebar-accent p-3 mb-3">
          <p className="text-sidebar-primary text-xs font-semibold uppercase tracking-wider mb-1">
            {"Status système"}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sidebar-foreground/70 text-xs">
              Tous les services en ligne
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-sidebar-foreground/50 hover:text-destructive transition-colors w-full px-3 py-2"
        >
          <LogOut className="h-4 w-4" />
          {"Déconnexion"}
        </button>
      </div>
    </aside>
  )
}
