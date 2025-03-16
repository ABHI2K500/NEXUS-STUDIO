"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  isLive?: boolean
  className?: string
}

export default function VideoPlayer({
  src,
  poster,
  title,
  isLive = false,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)

  // Check if the source is a YouTube URL
  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be')
  
  // Extract YouTube video ID
  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  const youtubeID = isYouTube ? getYouTubeID(src) : null;

  useEffect(() => {
    if (isYouTube) return; // Skip for YouTube videos
    
    let hideTimeout: NodeJS.Timeout

    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(hideTimeout)
      hideTimeout = setTimeout(() => setShowControls(false), 3000)
    }

    const container = videoRef.current?.parentElement
    container?.addEventListener("mousemove", handleMouseMove)

    return () => {
      container?.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(hideTimeout)
    }
  }, [isYouTube])

  const togglePlay = () => {
    if (isYouTube) return; // YouTube has its own controls
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (isYouTube) return; // YouTube has its own controls
    
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (isYouTube) return; // YouTube has its own fullscreen
    
    const container = videoRef.current?.parentElement
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleProgress = () => {
    if (isYouTube) return; // YouTube has its own progress
    
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const handleVolumeChange = (value: number) => {
    if (isYouTube) return; // YouTube has its own volume control
    
    if (videoRef.current) {
      videoRef.current.volume = value
      setVolume(value)
      setIsMuted(value === 0)
    }
  }

  const handleSeek = (value: number) => {
    if (isYouTube) return; // YouTube has its own seeking
    
    if (videoRef.current) {
      const time = (value / 100) * videoRef.current.duration
      videoRef.current.currentTime = time
      setProgress(value)
    }
  }

  // Render YouTube embed if it's a YouTube URL
  if (isYouTube && youtubeID) {
    return (
      <div className={cn("relative aspect-video rounded-lg overflow-hidden", className)}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeID}?autoplay=1&rel=0${isLive ? '&live=1' : ''}`}
          title={title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        
        {isLive && title && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white mr-2">
              LIVE
            </span>
            <span className="text-white font-medium drop-shadow-md">{title}</span>
          </div>
        )}
      </div>
    );
  }

  // Regular video player for non-YouTube sources
  return (
    <div
      className={cn(
        "relative group bg-black rounded-lg overflow-hidden",
        className
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full"
        onTimeUpdate={handleProgress}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Video Controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {title && (
          <div className="mb-2">
            <h3 className="text-white font-medium">{title}</h3>
            {isLive && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                LIVE
              </span>
            )}
          </div>
        )}

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-primary"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <div className="flex items-center space-x-2 min-w-[120px]">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-primary"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              className="w-24"
              onValueChange={(value) => handleVolumeChange(value[0] / 100)}
            />
          </div>

          {!isLive && (
            <div className="flex-1 mx-4">
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={(value) => handleSeek(value[0])}
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-primary"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 