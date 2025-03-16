"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import VideoPlayer from "@/components/video-player"

export default function TestVideoPage() {
  const [videoData, setVideoData] = useState({
    url: "https://www.youtube.com/watch?v=bJ5ClftUcBI",
    title: "Default Video",
    isLive: true
  })
  
  const [newUrl, setNewUrl] = useState("https://www.youtube.com/watch?v=bJ5ClftUcBI")
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchVideoData = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const response = await fetch("/api/video", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch video data: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log("Fetched video data:", data)
      setVideoData(data)
      setSuccess("Video data fetched successfully")
    } catch (err) {
      console.error("Error fetching video:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const updateVideo = async () => {
    try {
      setUpdating(true)
      setError(null)
      setSuccess(null)
      
      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({
          url: newUrl,
          title: "Updated Video",
          isLive: true
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update video data: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log("Updated video data:", data)
      
      // Fetch the updated data
      await fetchVideoData()
      
      setSuccess("Video updated successfully")
    } catch (err) {
      console.error("Error updating video:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    fetchVideoData()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Video API Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Current Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video rounded-md overflow-hidden border">
                  <VideoPlayer
                    src={videoData.url}
                    title={videoData.title}
                    isLive={videoData.isLive}
                  />
                </div>
                
                <div className="space-y-2">
                  <div><strong>URL:</strong> {videoData.url}</div>
                  <div><strong>Title:</strong> {videoData.title}</div>
                  <div><strong>Live:</strong> {videoData.isLive ? "Yes" : "No"}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={fetchVideoData} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Loading..." : "Refresh Video Data"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Update Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">YouTube URL</label>
                  <Input
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                
                {error && (
                  <div className="p-3 bg-red-100 text-red-800 rounded">
                    Error: {error}
                  </div>
                )}
                
                {success && (
                  <div className="p-3 bg-green-100 text-green-800 rounded">
                    {success}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={updateVideo} 
                disabled={updating}
                className="w-full"
              >
                {updating ? "Updating..." : "Update Video"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 