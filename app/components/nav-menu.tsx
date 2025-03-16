"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/esports", label: "Esports" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/join", label: "Join Us" },
]

export function NavMenu() {
  const pathname = usePathname()

  return (
    <nav className="oval-nav">
      <div className="flex items-center space-x-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-all duration-200",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
} 