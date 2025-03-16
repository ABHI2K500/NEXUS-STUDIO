"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image" 
import { motion, useAnimation, AnimatePresence } from "framer-motion"
// Replace imported hook with our custom hook
import { useInView } from "@/hooks/use-intersection"
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  MapPin, 
  Phone, 
  ArrowRight, 
  ChevronRight,
  Linkedin,
  Github,
  Sparkles,
  ExternalLink,
  ArrowUp,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export default function Footer() {
  const { resolvedTheme } = useTheme()
  const controls = useAnimation()
  const [emailValue, setEmailValue] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [hoverLink, setHoverLink] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [isChatBotOpen, setIsChatBotOpen] = useState(false)
  const footerRef = useRef<HTMLDivElement>(null)
  
  // Animation when footer comes into view - using our custom hook
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  // Listen for chatbot state change
  useEffect(() => {
    const handleChatbotStateChange = (event: any) => {
      setIsChatBotOpen(event.detail.isOpen);
    };
    
    window.addEventListener('chatbotStateChange', handleChatbotStateChange);
    
    return () => {
      window.removeEventListener('chatbotStateChange', handleChatbotStateChange);
    };
  }, []);

  // Handle scroll event to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailValue || !emailValue.trim()) {
      alert("Please enter a valid email address")
      return
    }
    
    console.log("Submitting newsletter subscription from footer for:", emailValue.trim())
    
    try {
      setSubmitted(false) // Reset submitted state in case of previous submission
      
      // Submit to API
      console.log("Sending request to /api/subscribe from footer")
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailValue.trim() })
      })
      
      console.log("Footer API response status:", response.status)
      
      // Get response data
      const responseData = await response.json().catch(err => {
        console.error("Error parsing response JSON in footer:", err)
        return null
      })
      console.log("Footer API response data:", responseData)
      
      if (!response.ok) {
        throw new Error(responseData?.message || "Failed to subscribe")
      }
      
      // Success
      console.log("Footer subscription successful")
      setSubmitted(true)
      setEmailValue("")
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error("Footer newsletter subscription error:", error)
      // Show error in UI
      const errorMessage = error instanceof Error ? error.message : "Failed to subscribe"
      
      // If it's already subscribed, show a different message
      if (errorMessage.includes("already subscribed")) {
        alert("This email is already subscribed to our newsletter.")
      } else {
        alert("Failed to subscribe: " + errorMessage)
      }
    }
  }

  const currentYear = new Date().getFullYear()
  
  const footerLinks = [
    {
      title: "Company",
      id: "company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Our Team", href: "/team" },
        { name: "News", href: "/news" },
      ],
    },
    {
      title: "Services",
      id: "services",
      links: [
        { name: "Live Streaming", href: "/services/live-streaming" },
        { name: "Media Production", href: "/services/media-production" },
        { name: "Digital Marketing", href: "/services/digital-marketing" },
        { name: "Esports", href: "/esports" },
      ],
    },
    {
      title: "Resources",
      id: "resources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Case Studies", href: "/case-studies" },
        { name: "Resources", href: "/resources" },
        { name: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Legal",
      id: "legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookies", href: "/cookies" },
        { name: "Accessibility", href: "/accessibility" },
      ],
    },
  ]

  // Animations
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const linkVariants = {
    initial: { x: 0 },
    hover: { x: 5, transition: { duration: 0.2 } },
  }

  // Logo hover effect
  const logoHoverVariants = {
    rest: { 
      scale: 1,
      textShadow: "0px 0px 0px rgba(var(--primary-rgb), 0)",
    },
    hover: { 
      scale: 1.05,
      textShadow: resolvedTheme === "dark" 
        ? "0px 0px 8px rgba(157, 78, 221, 0.7)" 
        : "0px 0px 8px rgba(10, 36, 99, 0.5)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }

  return (
    <footer 
      className={cn(
        "relative overflow-hidden border-t border-border pt-12 pb-8",
        resolvedTheme === "dark" ? "bg-black/40" : "bg-muted/30"
      )}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          {/* Grid lines */}
          <div className="absolute inset-0 data-grid-pattern" />
          
          {/* Circuit pattern */}
          <div className="absolute inset-0 opacity-30 circuit-pattern" />
          
          {/* Glowing orbs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 filter blur-[80px] opacity-30 animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/20 filter blur-[80px] opacity-30 animate-pulse" 
            style={{ animationDelay: '2s' }} 
          />
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref as unknown as React.RefObject<HTMLDivElement>}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8"
        >
          {/* Brand section */}
          <motion.div variants={childVariants} className="lg:col-span-4">
            <div className="mb-6">
              <Link href="/">
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  variants={logoHoverVariants}
                  className="inline-block"
                >
                  <span className="text-3xl font-bold animated-gradient-text">NEXUS</span>
                </motion.div>
              </Link>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md text-pretty">
              Creating innovative digital experiences that captivate audiences and drive results. 
              Our team of experts is dedicated to bringing your vision to life using cutting-edge technology.
            </p>
            <div className="space-y-4">
              <motion.div 
                className="flex items-start group"
                whileHover={{ x: 3 }}
              >
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 transition-colors duration-300",
                  resolvedTheme === "dark" ? 
                    "bg-primary/20 group-hover:bg-primary/30" : 
                    "bg-primary/10 group-hover:bg-primary/20"
                )}>
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <p className="text-muted-foreground mt-1 group-hover:text-foreground transition-colors duration-300">
                  123 Digital Avenue, Tech City, TC 10011
                </p>
              </motion.div>
              
              <motion.div 
                className="flex items-start group"
                whileHover={{ x: 3 }}
              >
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 transition-colors duration-300",
                  resolvedTheme === "dark" ? 
                    "bg-primary/20 group-hover:bg-primary/30" : 
                    "bg-primary/10 group-hover:bg-primary/20"
                )}>
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <a 
                  href="mailto:contact@nexusstudios.com" 
                  className="text-muted-foreground mt-1 group-hover:text-primary transition-colors duration-300"
                >
                  contact@nexusstudios.com
                </a>
              </motion.div>
              
              <motion.div 
                className="flex items-start group"
                whileHover={{ x: 3 }}
              >
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 transition-colors duration-300",
                  resolvedTheme === "dark" ? 
                    "bg-primary/20 group-hover:bg-primary/30" : 
                    "bg-primary/10 group-hover:bg-primary/20"
                )}>
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <a 
                  href="tel:+15551234567" 
                  className="text-muted-foreground mt-1 group-hover:text-primary transition-colors duration-300"
                >
                  +1 (555) 123-4567
                </a>
              </motion.div>
            </div>

            {/* Awards/Recognition */}
            <motion.div
              variants={childVariants}
              className="mt-8 flex flex-wrap gap-4"
            >
              <div className="w-16 h-16 relative grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <Image 
                  src="/placeholder.svg?text=Award+1" 
                  alt="Industry Award" 
                  width={64}
                  height={64}
                  className="object-contain" 
                />
              </div>
              <div className="w-16 h-16 relative grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <Image 
                  src="/placeholder.svg?text=Award+2" 
                  alt="Industry Award" 
                  width={64}
                  height={64}
                  className="object-contain" 
                />
              </div>
              <div className="w-16 h-16 relative grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <Image 
                  src="/placeholder.svg?text=Award+3" 
                  alt="Industry Award" 
                  width={64}
                  height={64}
                  className="object-contain" 
                />
              </div>
            </motion.div>
          </motion.div>
          
          {/* Links Sections */}
          <motion.div variants={childVariants} className="lg:col-span-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {footerLinks.map((section) => (
              <div 
                key={section.title}
                onMouseEnter={() => setActiveSection(section.id)}
                onMouseLeave={() => setActiveSection(null)}
                className="relative"
              >
                <h3 className={cn(
                  "font-semibold mb-3 transition-colors duration-200 flex items-center",
                  activeSection === section.id ? "text-primary" : "text-foreground"
                )}>
                  {activeSection === section.id && (
                    <Sparkles className="h-3 w-3 mr-1.5 text-primary animate-pulse" />
                  )}
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <motion.div
                        initial="initial"
                        whileHover="hover"
                        animate={hoverLink === link.name ? "hover" : "initial"}
                        onMouseEnter={() => setHoverLink(link.name)}
                        onMouseLeave={() => setHoverLink(null)}
                      >
                        <Link 
                          href={link.href} 
                          className={cn(
                            "text-muted-foreground hover:text-primary transition-colors inline-flex items-center group",
                            hoverLink === link.name && "text-primary"
                          )}
                        >
                          <motion.span variants={linkVariants} className="inline-flex items-center">
                            <ChevronRight className={cn(
                              "h-3 w-3 mr-1 transition-opacity",
                              hoverLink === link.name ? "opacity-100" : "opacity-0"
                            )} />
                            {link.name}
                          </motion.span>
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
                {/* Line indicator */}
                <AnimatePresence>
                  {activeSection === section.id && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-0 w-0.5 bg-primary/50"
                      style={{ borderRadius: "1px" }}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
          
          {/* Newsletter */}
          <motion.div variants={childVariants} className="lg:col-span-3">
            <div className={cn(
              "p-5 rounded-xl relative overflow-hidden",
              resolvedTheme === "dark" 
                ? "glass-morphism" 
                : "bg-background/70 border border-border/50 backdrop-blur-md"
            )}>
              {/* Circuit background for futuristic look */}
              <div className="absolute inset-0 opacity-[0.02] circuit-pattern"></div>
              
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                Stay Updated
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Subscribe to our newsletter for the latest news and insights.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    icon={<Mail className="h-4 w-4" />}
                    futuristic={true}
                    className="pr-10 bg-background/50 backdrop-blur-sm"
                    required
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    disabled={submitted}
                  >
                    {submitted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                        className="text-green-500"
                      >
                        ✓
                      </motion.div>
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="text-xs flex items-center"
                    >
                      <div className="inline-flex items-center bg-green-500/10 text-green-500 rounded-full px-2 py-1">
                        <Sparkles className="h-3 w-3 mr-1" />
                        <span>Thank you for subscribing!</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
            
            <div className="mt-8">
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <ExternalLink className="h-4 w-4 mr-2 text-primary" />
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { 
                    icon: <Facebook className="h-4 w-4" />, 
                    label: "Facebook", 
                    href: "#",
                    color: resolvedTheme === "dark" 
                      ? "rgba(157, 78, 221, 0.6)" // dark-primary 
                      : "rgba(10, 36, 99, 0.4)",  // light-primary
                    hoverColor: resolvedTheme === "dark" ? "#9d4edd" : "#0a2463",
                  },
                  { 
                    icon: <Instagram className="h-4 w-4" />, 
                    label: "Instagram", 
                    href: "#",
                    color: resolvedTheme === "dark" 
                      ? "rgba(199, 125, 255, 0.6)" // dark-secondary
                      : "rgba(62, 146, 204, 0.4)", // light-secondary
                    hoverColor: resolvedTheme === "dark" ? "#c77dff" : "#3e92cc",
                  },
                  { 
                    icon: <Twitter className="h-4 w-4" />, 
                    label: "Twitter", 
                    href: "#", 
                    color: resolvedTheme === "dark" 
                      ? "rgba(123, 44, 191, 0.6)" // dark-accent
                      : "rgba(33, 118, 255, 0.4)", // light-accent
                    hoverColor: resolvedTheme === "dark" ? "#7b2cbf" : "#2176ff",
                  },
                  { 
                    icon: <Linkedin className="h-4 w-4" />, 
                    label: "LinkedIn", 
                    href: "#",
                    color: resolvedTheme === "dark" 
                      ? "rgba(157, 78, 221, 0.6)" 
                      : "rgba(10, 36, 99, 0.4)",
                    hoverColor: resolvedTheme === "dark" ? "#9d4edd" : "#0a2463",
                  },
                  { 
                    icon: <Youtube className="h-4 w-4" />, 
                    label: "YouTube", 
                    href: "#",
                    color: resolvedTheme === "dark" 
                      ? "rgba(199, 125, 255, 0.6)"
                      : "rgba(62, 146, 204, 0.4)",
                    hoverColor: resolvedTheme === "dark" ? "#c77dff" : "#3e92cc",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground transition-all duration-300",
                      resolvedTheme === "dark" ? "bg-muted/20" : "bg-muted"
                    )}
                    whileHover={{ 
                      scale: 1.1, 
                      color: social.hoverColor,
                      boxShadow: `0 0 8px ${social.color}`
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.1 * index + 0.5 }
                    }}
                    aria-label={`Visit our ${social.label} page`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Divider with tech-inspired pattern */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <div className={cn(
              "px-2",
              resolvedTheme === "dark" ? "bg-black/40" : "bg-muted/30"
            )}>
              {/* Animated pulse line */}
              <motion.div 
                className="h-2 w-20 rounded-full overflow-hidden"
                style={{
                  background: `linear-gradient(90deg, 
                    ${resolvedTheme === "dark" ? "rgba(157, 78, 221, 0.3)" : "rgba(10, 36, 99, 0.3)"} 0%, 
                    ${resolvedTheme === "dark" ? "rgba(123, 44, 191, 0.6)" : "rgba(33, 118, 255, 0.6)"} 50%, 
                    ${resolvedTheme === "dark" ? "rgba(157, 78, 221, 0.3)" : "rgba(10, 36, 99, 0.3)"} 100%
                  )`
                }}
              >
                <motion.div 
                  className="h-full w-full"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    background: `linear-gradient(90deg, 
                      transparent 0%, 
                      ${resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.6)"} 50%, 
                      transparent 100%
                    )`
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} NEXUS Studios. All rights reserved.
          </p>
          <motion.div 
            className="flex space-x-4 mt-4 sm:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Sitemap</Link>
            <span className="text-muted-foreground/30">|</span>
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Developers</Link>
            <span className="text-muted-foreground/30">|</span>
            <Link href="#" className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-3 w-3 mr-1" />
              GitHub
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && !isChatBotOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleScrollToTop}
            className={cn(
              "fixed bottom-24 right-8 z-50 h-12 w-12 rounded-full flex items-center justify-center shadow-lg",
              resolvedTheme === "dark" 
                ? "bg-primary text-white" 
                : "bg-primary text-white"
            )}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat support button */}
      <div className="fixed bottom-8 left-8 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(!chatOpen)}
          className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-colors",
            chatOpen 
              ? (resolvedTheme === "dark" ? "bg-primary/90" : "bg-primary/90") 
              : (resolvedTheme === "dark" ? "bg-primary text-white" : "bg-primary text-white"),
            chatOpen && "neon-glow"
          )}
          aria-label={chatOpen ? "Close chat" : "Open chat support"}
        >
          <MessageSquare className="h-5 w-5 text-white" />
        </motion.button>
        
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={cn(
                "absolute bottom-16 left-0 w-72 p-4 rounded-lg shadow-lg",
                resolvedTheme === "dark" 
                  ? "bg-card border border-border/60" 
                  : "bg-card border border-border/60"
              )}
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-sm">Customer Support</h4>
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="text-muted-foreground text-xs mb-3">
                Need help? Send us a message and we'll respond as soon as possible.
              </p>
              <div className="space-y-2">
                <Input 
                  placeholder="Your name" 
                  className="text-sm" 
                  futuristic={true}
                />
                <Input 
                  placeholder="Your email" 
                  type="email" 
                  className="text-sm" 
                  futuristic={true}
                />
                <textarea 
                  placeholder="How can we help you?" 
                  className="w-full p-2 text-sm rounded-md border border-input bg-background resize-none h-20 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <Button className="w-full">
                  Send Message
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </footer>
  )
}

