"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Home,
  Info,
  Layers,
  ImageIcon,
  FileText,
  Gamepad2,
  Users,
  Mail,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  MessageSquare,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NavItem {
  name: string
  path: string
  icon: React.ReactNode
  badge?: number
}

export default function HoverSidebar() {
  const [expanded, setExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const navItems: NavItem[] = [
    { name: "Home", path: "/", icon: <Home className="icon" /> },
    { name: "About", path: "/about", icon: <Info className="icon" /> },
    { name: "Services", path: "/services", icon: <Layers className="icon" /> },
    { name: "Portfolio", path: "/portfolio", icon: <ImageIcon className="icon" /> },
    { name: "Blog", path: "/blog", icon: <FileText className="icon" /> },
    { name: "Esports", path: "/esports", icon: <Gamepad2 className="icon" /> },
    { name: "Join Us", path: "/join-us", icon: <Users className="icon" /> },
    { name: "Contact", path: "/contact", icon: <Mail className="icon" /> },
  ]

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "zh", name: "中文" },
  ]

  if (!mounted) return null

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-4 z-50 rounded-full lg:hidden"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-screen bg-card border-r border-border z-40 overflow-hidden ${
          isMobile ? "shadow-xl" : ""
        }`}
        initial={{ width: isMobile ? 0 : 72 }}
        animate={{
          width: isMobile ? (expanded ? 280 : 0) : expanded ? 280 : 72,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onHoverStart={() => !isMobile && setExpanded(true)}
        onHoverEnd={() => !isMobile && setExpanded(false)}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-border">
            <Link href="/" className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-primary-foreground font-bold text-xl">
                N
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-3 font-semibold text-xl whitespace-nowrap"
              >
                NEXUS Studios
              </motion.div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <TooltipProvider key={item.path} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.path}
                        className={`hover-sidebar-item group ${pathname === item.path ? "active" : ""}`}
                      >
                        {item.icon}
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: expanded ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text"
                        >
                          {item.name}
                        </motion.span>
                        {item.badge && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                            <Badge
                              variant="secondary"
                              className="h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                            >
                              {item.badge}
                            </Badge>
                          </motion.div>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {!expanded && <TooltipContent side="right">{item.name}</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="px-1 space-y-1">
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="hover-sidebar-item w-full justify-start"
                        onClick={() => {
                          // Open chatbot
                        }}
                      >
                        <MessageSquare className="icon" />
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: expanded ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text"
                        >
                          AI Assistant
                        </motion.span>
                      </Button>
                    </TooltipTrigger>
                    {!expanded && <TooltipContent side="right">AI Assistant</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="hover-sidebar-item w-full justify-start"
                        onClick={() => {
                          // Open notifications
                        }}
                      >
                        <Bell className="icon" />
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: expanded ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text"
                        >
                          Notifications
                        </motion.span>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                          <Badge
                            variant="destructive"
                            className="h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                          >
                            3
                          </Badge>
                        </motion.div>
                      </Button>
                    </TooltipTrigger>
                    {!expanded && <TooltipContent side="right">Notifications</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="hover-sidebar-item w-full justify-start">
                            <Globe className="icon" />
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: expanded ? 1 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text"
                            >
                              Language
                            </motion.span>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: expanded ? 1 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-auto"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </motion.div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={expanded ? "end" : "start"} side={expanded ? "right" : "right"}>
                          {languages.map((lang) => (
                            <DropdownMenuItem
                              key={lang.code}
                              onClick={() => setLanguage(lang.code as any)}
                              className={language === lang.code ? "bg-muted" : ""}
                            >
                              {lang.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipTrigger>
                    {!expanded && <TooltipContent side="right">Language</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="hover-sidebar-item">
                        {theme === "dark" ? <Moon className="icon" /> : <Sun className="icon" />}
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: expanded ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text"
                        >
                          Dark Mode
                        </motion.span>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: expanded ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-auto"
                        >
                          <Switch
                            checked={theme === "dark"}
                            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                          />
                        </motion.div>
                      </div>
                    </TooltipTrigger>
                    {!expanded && <TooltipContent side="right">Dark Mode</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="hover-sidebar-item w-full justify-start"
                        onClick={() => {
                          // Open settings
                        }}
                      >
                        <Settings className="icon" />
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: expanded ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text"
                        >
                          Settings
                        </motion.span>
                      </Button>
                    </TooltipTrigger>
                    {!expanded && <TooltipContent side="right">Settings</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* User profile */}
          <div className="border-t border-border p-4">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-3 overflow-hidden"
              >
                <p className="text-sm font-medium truncate">Guest User</p>
                <p className="text-xs text-muted-foreground truncate">guest@example.com</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-auto"
              >
                <Button variant="ghost" size="icon">
                  <LogOut className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

