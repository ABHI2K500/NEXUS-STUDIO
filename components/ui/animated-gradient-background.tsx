"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"

interface AnimatedGradientBackgroundProps {
  children?: React.ReactNode
  className?: string
  interactive?: boolean
  intensity?: "light" | "medium" | "strong"
  scanLines?: boolean
}

export function AnimatedGradientBackground({
  children,
  className,
  interactive = true,
  intensity = "medium",
  scanLines = true,
}: AnimatedGradientBackgroundProps) {
  const { resolvedTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  
  // Calculate opacity based on intensity
  const getOpacity = () => {
    switch (intensity) {
      case "light": return { base: 0.3, interactive: 0.4 }
      case "strong": return { base: 0.6, interactive: 0.7 }
      default: return { base: 0.5, interactive: 0.6 }
    }
  }
  
  const opacitySettings = getOpacity()
  
  // Interactive mouse movement effect
  useEffect(() => {
    if (!interactive || !containerRef.current) return
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - left) / width) * 100
      const y = ((e.clientY - top) / height) * 100
      
      setMousePosition({ x, y })
      
      // Update CSS variables for the blob positions
      containerRef.current.style.setProperty("--mouse-x", `${x}%`)
      containerRef.current.style.setProperty("--mouse-y", `${y}%`)
    }
    
    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)
    
    const element = containerRef.current
    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseenter", handleMouseEnter)
    element.addEventListener("mouseleave", handleMouseLeave)
    
    return () => {
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseenter", handleMouseEnter)
      element.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [interactive])
  
  return (
    <div
      ref={containerRef}
      className={cn(
        "animate-gradient-background relative overflow-hidden",
        resolvedTheme === "dark" ? "dark-gradient" : "light-gradient",
        scanLines && "scan-lines",
        className
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ opacity: opacitySettings.base }}>
        {/* Static blobs */}
        <div 
          className="absolute top-0 -left-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          style={{ 
            background: resolvedTheme === "dark" 
              ? "rgba(157, 78, 221, 0.3)" // dark-primary
              : "rgba(10, 36, 99, 0.3)"   // light-primary
          }}
        />
        <div 
          className="absolute top-0 -right-4 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          style={{ 
            background: resolvedTheme === "dark" 
              ? "rgba(199, 125, 255, 0.3)" // dark-secondary
              : "rgba(62, 146, 204, 0.3)"   // light-secondary
          }}
        />
        <div 
          className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
          style={{ 
            background: resolvedTheme === "dark" 
              ? "rgba(123, 44, 191, 0.3)" // dark-accent
              : "rgba(33, 118, 255, 0.3)" // light-accent
          }}
        />
        
        {/* Interactive blob that follows mouse */}
        {interactive && (
          <motion.div 
            className="absolute w-56 h-56 rounded-full mix-blend-multiply filter blur-xl"
            style={{
              background: resolvedTheme === "dark" 
                ? "rgba(157, 78, 221, 0.3)" 
                : "rgba(10, 36, 99, 0.2)",
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              opacity: isHovering ? opacitySettings.interactive : 0,
              transition: "opacity 0.5s ease-out",
            }}
            animate={{
              x: "-50%",
              y: "-50%",
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 30
            }}
          />
        )}
      </div>
      
      {/* Circuit board pattern overlay for tech feel */}
      <div className="absolute inset-0 opacity-[0.03] circuit-pattern" />
      
      {/* Futuristic data grid */}
      <div className="absolute inset-0 data-grid-pattern" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

