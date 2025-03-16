"use client"

import { useEffect, useState } from "react"
import { Video, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface VideoUpdateNotificationProps {
  url: string
  title: string
  isLive: boolean
}

export default function VideoUpdateNotification({ url, title, isLive }: VideoUpdateNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-hide after 8 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  // Extract YouTube video ID for thumbnail
  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const youtubeID = getYouTubeID(url)
  const thumbnailUrl = youtubeID ? `https://img.youtube.com/vi/${youtubeID}/mqdefault.jpg` : null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-background rounded-lg shadow-lg border p-4"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <Video className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="font-medium text-lg">Video Updated Successfully</h3>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {thumbnailUrl && (
            <div className="mb-3 rounded-md overflow-hidden">
              <img 
                src={thumbnailUrl} 
                alt={title} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          <div className="space-y-2 mb-3">
            <div className="text-sm"><span className="font-medium">Title:</span> {title}</div>
            <div className="text-sm break-all"><span className="font-medium">URL:</span> {url}</div>
            <div className="text-sm">
              <span className="font-medium">Status:</span>{" "}
              {isLive ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  LIVE
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  Not Live
                </span>
              )}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            The video has been updated on all pages.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 