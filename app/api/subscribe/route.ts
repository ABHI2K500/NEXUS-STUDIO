import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("Newsletter subscription API route called")
  try {
    const body = await request.json()
    console.log("Request body:", body)
    const { email } = body
    
    if (!email || typeof email !== 'string') {
      console.log("Email validation failed: Email is required")
      return new NextResponse(JSON.stringify({ message: "Email is required" }), { 
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
    
    // Check if email already exists
    console.log("Checking if email already exists:", email)
    const { data: existingSubscriber, error: existingError } = await supabase
      .from("email_subscribers")
      .select("id")
      .eq("email", email)
      .single()
      
    if (existingError && existingError.code !== 'PGRST116') {
      console.error("Error checking existing subscriber:", existingError)
      throw existingError
    }
      
    if (existingSubscriber) {
      console.log("Email already subscribed:", email)
      return new NextResponse(JSON.stringify({ message: "Email already subscribed" }), { 
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Add new subscriber
    console.log("Adding new subscriber:", email)
    const { error } = await supabase
      .from("email_subscribers")
      .insert({ email })
      
    if (error) {
      console.error("Error inserting subscriber:", error)
      throw error
    }
    
    console.log("Subscription successful for:", email)
    return new NextResponse(JSON.stringify({ message: "Subscription successful" }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
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