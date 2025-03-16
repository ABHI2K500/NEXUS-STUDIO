"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import VideoUpdateNotification from "./video-update-notification"

interface VideoUpdateContextType {
  showVideoUpdateNotification: (url: string, title: string, isLive: boolean) => void
}

const VideoUpdateContext = createContext<VideoUpdateContextType | undefined>(undefined)

interface VideoUpdateProviderProps {
  children: ReactNode
}

export function VideoUpdateProvider({ children }: VideoUpdateProviderProps) {
  const [showNotification, setShowNotification] = useState(false)
  const [videoDetails, setVideoDetails] = useState({
    url: "",
    title: "",
    isLive: false
  })

  const showVideoUpdateNotification = (url: string, title: string, isLive: boolean) => {
    setVideoDetails({ url, title, isLive })
    setShowNotification(true)
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      setShowNotification(false)
    }, 10000)
  }

  return (
    <VideoUpdateContext.Provider value={{ showVideoUpdateNotification }}>
      {children}
      {showNotification && (
        <VideoUpdateNotification 
          url={videoDetails.url} 
          title={videoDetails.title} 
          isLive={videoDetails.isLive} 
        />
      )}
    </VideoUpdateContext.Provider>
  )
}

export function useVideoUpdate() {
  const context = useContext(VideoUpdateContext)
  if (context === undefined) {
    throw new Error("useVideoUpdate must be used within a VideoUpdateProvider")
  }
  return context
} 