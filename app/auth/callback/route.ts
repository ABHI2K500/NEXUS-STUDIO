import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const isAdmin = requestUrl.searchParams.get('isAdmin') === 'true'
  
  console.log("Auth callback route called, code present:", !!code, "isAdmin:", isAdmin)
  
  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(requestUrl.origin + '/auth/login?error=auth_callback_error')
      }
      
      console.log("Successfully exchanged code for session, user:", data.session?.user.id)
      
      // Check user role to determine redirect
      if (data.session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single()
          
        if (!profileError && profile?.role === 'admin') {
          console.log("Admin user authenticated, redirecting to admin dashboard")
          return NextResponse.redirect(requestUrl.origin + '/admin/dashboard')
        }
        
        // If admin login was requested but user is not an admin
        if (isAdmin && (!profile || profile.role !== 'admin')) {
          console.log("Admin login requested but user is not an admin, signing out")
          await supabase.auth.signOut()
          return NextResponse.redirect(requestUrl.origin + '/auth/login?isAdmin=true&error=unauthorized')
        }
      }
      
      // Default redirect to user dashboard
      return NextResponse.redirect(requestUrl.origin + '/dashboard')
    } catch (err) {
      console.error("Exception in auth callback:", err)
      return NextResponse.redirect(requestUrl.origin + '/auth/login?error=auth_exception')
    }
  }

  // Fallback redirect if no code is present
  return NextResponse.redirect(requestUrl.origin + '/auth/login')
} 