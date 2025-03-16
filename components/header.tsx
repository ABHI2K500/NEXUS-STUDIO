"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogIn, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { createClient } from "@/lib/supabase"
import LanguageSelector from "@/components/language-selector"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const { t } = useLanguage()

  // Handle scroll event to add background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Auth check error:", error)
          return
        }
        
        if (session) {
          setUser(session.user)
          
          // Get user role
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()
            
          if (!profileError && profile) {
            setUserRole(profile.role)
          }
        }
      } catch (err) {
        console.error("Auth check exception:", err)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])
  
  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      setUserRole(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/esports", label: "Esports" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/join-us", label: "Join Us" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold gradient-text">NEXUS</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4 oval-nav edge-light neon-glow">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors rounded-full",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons, language selector, and theme toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
            
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Account</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={userRole === "admin" ? "/admin/dashboard" : "/dashboard"}>
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut}>
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild variant="default" size="sm" className="gap-2">
                    <Link href="/auth/login">
                      <LogIn className="h-4 w-4" />
                      <span className="hidden sm:inline">Login</span>
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-t">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 text-sm font-medium rounded-full transition-colors",
                  pathname === link.href 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile auth links */}
            {user ? (
              <>
                <Link
                  href={userRole === "admin" ? "/admin/dashboard" : "/dashboard"}
                  className="px-4 py-3 text-sm font-medium rounded-full transition-colors text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-sm font-medium rounded-full transition-colors text-destructive"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-3 text-sm font-medium rounded-full transition-colors text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login / Sign up
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

