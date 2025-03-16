import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log("Testing Supabase connection")
    
    // Create a direct Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        error: "Missing Supabase credentials", 
        env: {
          url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test a simple query
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.error("Supabase query error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Supabase connection successful",
      data
    })
  } catch (err) {
    console.error("Test Supabase error:", err)
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : "Unknown error" 
    }, { status: 500 })
  }
} 