import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt="La Magie du Soir"
              width={36}
              height={36}
              className="rounded-md"
            />
            <span className="text-foreground font-bold text-sm uppercase tracking-wider">
              La Magie du Soir 2026
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-xs">
            <Link href="#" className="hover:text-primary transition-colors">
              {"Confidentialit\u00e9"}
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Presse
            </Link>
            <Link href="#contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              FAQ
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+22901975096422"
              className="flex items-center gap-2 text-primary text-xs hover:text-primary/80 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              +229 01 97 50 96 42
            </a>
            <span className="text-border">|</span>
            <a
              href="tel:+22901603099998"
              className="flex items-center gap-2 text-primary text-xs hover:text-primary/80 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              +229 01 60 30 99 98
            </a>
          </div>
        </div>

        <div className="text-center mt-8 pt-6 border-t border-border">
          <p className="text-muted-foreground text-xs">
            {"© 2026 La Magie du Soir. Tous droits r\u00e9serv\u00e9s."}
          </p>
        </div>
      </div>
    </footer>
  )
}
