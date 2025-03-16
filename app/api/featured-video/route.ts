import { createClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'; // Disable caching for this route
export const revalidate = 0; // Disable caching for this route

export async function GET() {
  const supabase = createClient()
  
  try {
    console.log("Fetching featured video from database");
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "featured_video")
      .single()
    
    if (error) {
      console.error("Error fetching featured video from database:", error);
      return NextResponse.json({ error: error.message }, { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      })
    }
    
    console.log("Fetched featured video data:", data);
    
    const response = NextResponse.json({ 
      url: data?.value || "https://www.youtube.com/watch?v=bJ5ClftUcBI",
      title: data?.metadata?.title || "Live Tournament Stream",
      isLive: data?.metadata?.isLive || true
    });
    
    // Set cache control headers
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (err) {
    console.error("Unexpected error in featured video GET:", err);
    return NextResponse.json({ 
      url: "https://www.youtube.com/watch?v=bJ5ClftUcBI",
      title: "Live Tournament Stream",
      isLive: true
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  }
}

export async function POST(request: Request) {
  const supabase = createClient()
  
  try {
    const { url, title, isLive } = await request.json()
    console.log("Updating featured video with:", { url, title, isLive });
    
    // Check if the record exists
    const { data: existingData } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "featured_video")
      .single()
    
    if (existingData) {
      // Update existing record
      console.log("Updating existing record");
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
      console.log("Creating new record");
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
    
    console.log("Featured video updated successfully");
    const response = NextResponse.json({ success: true });
    
    // Set cache control headers
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error("Error updating featured video:", error);
    return NextResponse.json({ error: error.message }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    })
  }
} 