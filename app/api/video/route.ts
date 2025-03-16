import { NextResponse } from "next/server"

// Default video data
const defaultVideo = {
  url: "https://www.youtube.com/watch?v=bJ5ClftUcBI",
  title: "Live Tournament Stream",
  isLive: true
}

// In-memory storage as a fallback
let videoData = { ...defaultVideo }

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  console.log("GET /api/video - Returning video data:", videoData)
  
  // Set cache control headers to prevent caching
  const response = NextResponse.json(videoData)
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  
  return response
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("POST /api/video - Received data:", data)
    
    // Validate the data
    if (!data.url || !data.title) {
      return NextResponse.json(
        { error: "URL and title are required" },
        { status: 400 }
      )
    }
    
    // Update the video data
    videoData = {
      url: data.url,
      title: data.title,
      isLive: data.isLive || false
    }
    
    console.log("POST /api/video - Updated video data:", videoData)
    
    // Set cache control headers to prevent caching
    const response = NextResponse.json({ success: true, data: videoData })
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error("POST /api/video - Error:", error)
    return NextResponse.json(
      { error: "Failed to update video data" },
      { status: 500 }
    )
  }
} 