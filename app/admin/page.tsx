"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function AdminPage() {
  const router = useRouter()
  
  // Check if user is already logged in and is an admin
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("Session check error:", sessionError)
          return
        }
        
        if (session) {
          console.log("Session found:", session.user.id)
          // Check if user has admin role
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()

          if (profileError) {
            console.error("Profile check error:", profileError)
            return
          }

          if (profile?.role === "admin") {
            console.log("Admin role confirmed, redirecting to dashboard")
            router.push("/admin/dashboard")
          } else {
            console.log("Not an admin, redirecting to user dashboard")
            router.push("/dashboard")
          }
        } else {
          // Redirect to the new login page with admin flag
          router.push("/auth/login?isAdmin=true")
        }
      } catch (err) {
        console.error("Session check exception:", err)
      }
    }
    
    checkSession()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Redirecting to admin login...</p>
      </div>
    </div>
  )
} 