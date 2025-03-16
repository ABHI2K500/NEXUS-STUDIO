import { createClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("key", "featured_video")
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ 
    url: data?.value || "https://www.youtube.com/watch?v=bJ5ClftUcBI",
    title: data?.metadata?.title || "Live Tournament Stream",
    isLive: data?.metadata?.isLive || true
  })
}

export async function POST(request: Request) {
  const supabase = createClient()
  
  try {
    const { url, title, isLive } = await request.json()
    
    // Check if the record exists
    const { data: existingData } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "featured_video")
      .single()
    
    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from("settings")
        .update({ 
          value: url,
          metadata: { title, isLive }
        })
        .eq("key", "featured_video")
      
      if (error) throw error
    } else {
      // Insert new record
      const { error } = await supabase
        .from("settings")
        .insert([
          { 
            key: "featured_video", 
            value: url,
            metadata: { title, isLive }
          }
        ])
      
      if (error) throw error
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 