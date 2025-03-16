"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MessageSquare,
  Globe,
  Moon,
  Sun,
  Menu,
  X,
  Home,
  Info,
  Layers,
  ImageIcon,
  FileText,
  Gamepad2,
  Users,
  Mail,
  Settings,
  Bell,
  Bookmark,
  Heart,
  Share2,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import ChatbotDialog from "@/components/chatbot-dialog"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(3)

  // Ensure theme is only accessed on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "zh", name: "中文" },
  ]

  const navItems = [
    { name: "Home", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "About", path: "/about", icon: <Info className="h-5 w-5" /> },
    { name: "Services", path: "/services", icon: <Layers className="h-5 w-5" /> },
    { name: "Portfolio", path: "/portfolio", icon: <ImageIcon className="h-5 w-5" /> },
    { name: "Blog", path: "/blog", icon: <FileText className="h-5 w-5" /> },
    { name: "Esports", path: "/esports", icon: <Gamepad2 className="h-5 w-5" /> },
    { name: "Join Us", path: "/join-us", icon: <Users className="h-5 w-5" /> },
    { name: "Contact", path: "/contact", icon: <Mail className="h-5 w-5" /> },
  ]

  if (!mounted) {
    return null
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 rounded-full h-10 w-10 shadow-md border-2"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open sidebar</span>
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md font-bold text-xl">ABC</span>
                  <span className="font-semibold text-xl">Studios</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close sidebar</span>
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto py-2">
              <div className="px-4 py-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">NAVIGATION</h3>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        pathname === item.path ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <Separator className="my-4" />

              <div className="px-4 py-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">FEATURES</h3>

                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setIsChatbotOpen(true)
                      setIsOpen(false)
                    }}
                  >
                    <MessageSquare className="h-5 w-5 mr-3" />
                    AI Chatbot
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        <Globe className="h-5 w-5 mr-3" />
                        Language: {languages.find((lang) => lang.code === language)?.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
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

                  {/* Dark mode switch is completely removed here */}

                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="h-5 w-5 mr-3" />
                    Notifications
                    {notifications > 0 && (
                      <Badge className="ml-auto" variant="destructive">
                        {notifications}
                      </Badge>
                    )}
                  </Button>

                  <Button variant="ghost" className="w-full justify-start">
                    <Bookmark className="h-5 w-5 mr-3" />
                    Saved Items
                  </Button>

                  <Button variant="ghost" className="w-full justify-start">
                    <Heart className="h-5 w-5 mr-3" />
                    Favorites
                  </Button>

                  <Button variant="ghost" className="w-full justify-start">
                    <Share2 className="h-5 w-5 mr-3" />
                    Share
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="px-4 py-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">SETTINGS</h3>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <HelpCircle className="h-5 w-5 mr-3" />
                    Help & Support
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">Need assistance?</p>
                <p className="text-xs text-muted-foreground mb-3">Our team is here to help with any questions.</p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsChatbotOpen(true)
                    setIsOpen(false)
                  }}
                >
                  Chat with Us
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ChatbotDialog open={isChatbotOpen} onOpenChange={setIsChatbotOpen} />
    </>
  )
}

