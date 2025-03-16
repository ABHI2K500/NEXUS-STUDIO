"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
  storageKey?: string
  attribute?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "theme",
  attribute = "class",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light")
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  useEffect(() => {
    const root = window.document.documentElement
    const savedTheme = localStorage.getItem(storageKey) as Theme | null

    if (savedTheme) {
      setTheme(savedTheme)
    } else if (enableSystem) {
      setTheme("system")
    }
  }, [enableSystem, storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    if (theme === "system") {
      const systemTheme = prefersDarkMode ? "dark" : "light"
      
      root.classList.remove("light", "dark")
      root.classList.add(systemTheme)
      root.style.colorScheme = systemTheme
      setResolvedTheme(systemTheme)
      return
    }

    root.classList.remove("light", "dark")
    root.classList.add(theme)
    root.style.colorScheme = theme
    setResolvedTheme(theme as "light" | "dark")
  }, [theme, prefersDarkMode])

  const value = {
    theme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")
  
  return context
}

