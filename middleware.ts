import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log("Middleware running for path:", request.nextUrl.pathname)
  
  // Skip middleware for auth callback routes
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    console.log("Skipping middleware for auth callback")
    return NextResponse.next()
  }
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Check authentication for protected routes
  if (
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/admin/dashboard')
  ) {
    console.log("Checking auth for protected route:", request.nextUrl.pathname)
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error("Session error in middleware:", error)
    }
    
    if (!session) {
      console.log("No session found, redirecting to login")
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    console.log("Session found for user:", session.user.id)
    
    // For admin routes, check if user has admin role
    if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
        
      if (profileError) {
        console.error("Profile error in middleware:", profileError)
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
        
      if (profile?.role !== 'admin') {
        console.log("User is not an admin, redirecting to user dashboard")
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      
      console.log("Admin access granted")
    }
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/dashboard/:path*',
    '/auth/callback'
  ],
} 