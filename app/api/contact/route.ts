import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("Contact form API route called")
  try {
    const body = await request.json()
    console.log("Request body:", body)
    const { name, email, message } = body
    
    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      console.log("Name validation failed: Name is required")
      return new NextResponse(JSON.stringify({ message: "Name is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    if (!email || typeof email !== 'string' || !email.trim()) {
      console.log("Email validation failed: Email is required")
      return new NextResponse(JSON.stringify({ message: "Email is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    if (!message || typeof message !== 'string' || !message.trim()) {
      console.log("Message validation failed: Message is required")
      return new NextResponse(JSON.stringify({ message: "Message is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("Email validation failed: Invalid email format", email)
      return new NextResponse(JSON.stringify({ message: "Invalid email format" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    console.log("Creating Supabase client")
    const supabase = createRouteHandlerClient({ cookies })
    
    // Store contact submission
    console.log("Storing contact submission for:", email)
    const { error } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        message,
        created_at: new Date().toISOString()
      })
      
    if (error) {
      console.error("Error inserting contact submission:", error)
      throw error
    }
    
    console.log("Contact form submission successful for:", email)
    return new NextResponse(JSON.stringify({ message: "Contact form submitted successfully" }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return new NextResponse(
      JSON.stringify({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 