"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugVideo() {
  const [videoData, setVideoData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [newUrl, setNewUrl] = useState("https://www.youtube.com/watch?v=bJ5ClftUcBI")
  const [updating, setUpdating] = useState(false)

  const fetchVideoData = async () => {
    try {
      setLoading(true)
      setError(null)
      
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
      setVideoData(data)
      setNewUrl(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const updateVideo = async () => {
    try {
      setUpdating(true)
      setError(null)
      
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
      
      await fetchVideoData()
      
      // Force reload the page to update the video
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    if (showDebug) {
      fetchVideoData()
    }
  }, [showDebug])

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowDebug(true)}
        >
          Debug Video
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80">
      <Card>
        <CardHeader className="py-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">Video Debug</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDebug(false)}
            >
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <div className="space-y-2 text-xs">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchVideoData} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Loading..." : "Refresh Data"}
            </Button>
            
            {error && (
              <div className="p-2 bg-red-100 text-red-800 rounded">
                Error: {error}
              </div>
            )}
            
            {videoData && (
              <div className="space-y-1">
                <div><strong>URL:</strong> {videoData.url}</div>
                <div><strong>Title:</strong> {videoData.title}</div>
                <div><strong>Live:</strong> {videoData.isLive ? "Yes" : "No"}</div>
                <div className="pt-2 text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            )}
            
            <div className="border-t pt-2 mt-2">
              <div className="font-medium mb-1">Update Video</div>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full p-1 text-xs border rounded mb-2"
                placeholder="YouTube URL"
              />
              <Button 
                variant="default" 
                size="sm" 
                onClick={updateVideo} 
                disabled={updating}
                className="w-full"
              >
                {updating ? "Updating..." : "Update & Reload"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 