"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  Video,
  Camera,
  BarChart3,
  Calendar,
  Gamepad2,
  Sparkles,
  Zap,
  Award,
  Users,
  Globe,
  TrendingUp,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { AnimatedGradientBackground } from "@/components/ui/animated-gradient-background"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import LanguageSelector from "@/components/language-selector"
import EsportsLeaderboard from "@/components/esports/leaderboard"
import VideoPlayer from "@/components/video-player"
import ThemeToggle from "@/components/theme-toggle"
import NewsletterForm from "@/components/newsletter-form"
import Chat from '@/components/Chat'
import { useVideoUpdate } from "@/components/video-update-provider"
import DebugVideo from "@/components/debug-video"

// Update the getFeaturedVideo function to use absolute URL and no caching
async function getFeaturedVideo() {
  try {
    // Use absolute URL with origin to ensure it works in all environments
    const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || '';
    const response = await fetch(`${origin}/api/video`, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      console.error("Error fetching featured video:", response.statusText);
      return {
        url: "https://www.youtube.com/watch?v=bJ5ClftUcBI",
        title: "Live Tournament Stream",
        isLive: true
      };
    }
    
    const data = await response.json();
    console.log("Fetched video data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching featured video:", error);
    return {
      url: "https://www.youtube.com/watch?v=bJ5ClftUcBI",
      title: "Live Tournament Stream",
      isLive: true
    };
  }
}

export default function Home() {
  const { t } = useLanguage()
  const { resolvedTheme } = useTheme()
  const { scrollY } = useScroll()
  const ref = useRef(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [featuredVideo, setFeaturedVideo] = useState({
    url: "https://www.youtube.com/watch?v=bJ5ClftUcBI",
    title: "Live Tournament Stream",
    isLive: true
  })
  const { showVideoUpdateNotification } = useVideoUpdate()
  const [lastVideoUrl, setLastVideoUrl] = useState("")

  // Parallax effect
  const y1 = useTransform(scrollY, [0, 1000], [0, 300])
  const y2 = useTransform(scrollY, [0, 1000], [0, -300])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // Stats counter
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    awards: 0,
    countries: 0,
  })

  // Mouse position state for hover effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Fetch featured video with a refresh interval
    const loadFeaturedVideo = async () => {
      try {
        const videoData = await getFeaturedVideo();
        console.log("Setting featured video:", videoData);
        
        // Check if the video URL has changed
        if (lastVideoUrl && lastVideoUrl !== videoData.url) {
          // Show notification only if this isn't the first load
          showVideoUpdateNotification(videoData.url, videoData.title, videoData.isLive);
        }
        
        // Update state
        setFeaturedVideo(videoData);
        setLastVideoUrl(videoData.url);
      } catch (err) {
        console.error("Error loading featured video:", err);
      }
    };
    
    // Load immediately
    loadFeaturedVideo();
    
    // Then refresh every minute to catch updates
    const refreshInterval = setInterval(loadFeaturedVideo, 60 * 1000);
    
    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);

    // Animate stats when in view
    const targetStats = {
      projects: 250,
      clients: 120,
      awards: 35,
      countries: 18,
    }

    const interval = setInterval(() => {
      setStats((prev) => {
        const newStats = { ...prev }
        let completed = true

        Object.keys(targetStats).forEach((key) => {
          if (prev[key as keyof typeof prev] < targetStats[key as keyof typeof targetStats]) {
            newStats[key as keyof typeof newStats] = prev[key as keyof typeof prev] + 1
            completed = false
          }
        })

        if (completed) clearInterval(interval)
        return newStats
      })
    }, 30)
  }, [lastVideoUrl, showVideoUpdateNotification]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <AnimatedGradientBackground className="min-h-screen flex items-center justify-center relative pt-24">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center-align py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <Badge variant="outline" className="mb-8 px-4 py-1 text-sm font-medium border-primary/30 bg-primary/5">
                <Sparkles className="h-4 w-4 mr-2 text-primary" /> Innovative Digital Solutions
              </Badge>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-10 gradient-text leading-normal px-6 py-4">{t("home.hero.title")}</h1>

              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-center-align leading-relaxed">{t("home.hero.subtitle")}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" className="group" asChild>
                  <Link href="/services">
                    {t("home.cta.explore")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">{t("nav.contact_us") || "Contact Us"}</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="text-center-align space-y-2">
                <h3 className="text-4xl font-bold gradient-text">{stats.projects}+</h3>
                <p className="text-muted-foreground mt-2">Projects Completed</p>
              </div>
              <div className="text-center-align space-y-2">
                <h3 className="text-4xl font-bold gradient-text">{stats.clients}+</h3>
                <p className="text-muted-foreground mt-2">Happy Clients</p>
              </div>
              <div className="text-center-align space-y-2">
                <h3 className="text-4xl font-bold gradient-text">{stats.awards}</h3>
                <p className="text-muted-foreground mt-2">Awards Won</p>
              </div>
              <div className="text-center-align space-y-2">
                <h3 className="text-4xl font-bold gradient-text">{stats.countries}</h3>
                <p className="text-muted-foreground mt-2">Countries Served</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating elements with updated theme colors */}
        <motion.div
          className="absolute top-1/4 left-10 w-20 h-20 rounded-full backdrop-blur-xl bg-primary/20"
          style={{ y: y1 }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full backdrop-blur-xl bg-accent/20"
          style={{ y: y2 }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 270, 180, 90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </AnimatedGradientBackground>

      {/* Services Section with Enhanced Hover Effects */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center-align max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium border-primary/30 bg-primary/5">
              Our Expertise
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text px-6 py-4">Comprehensive Digital Services</h2>
            <p className="text-muted-foreground">
              We offer end-to-end solutions for all your digital media needs, from concept to execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Video className="h-6 w-6 text-primary" />,
                title: "Live Streaming",
                description:
                  "Professional multi-camera live streaming for virtual events, conferences, and broadcasts with real-time graphics and audience engagement.",
                  link: "/services/live-streaming",
                custom: true,
              },
              {
                icon: <Camera className="h-6 w-6 text-primary" />,
                title: "Media Production",
                description:
                  "High-quality video and photo production services for commercials, corporate videos, and promotional content.",
                link: "/services/media-production",
              },
              {
                icon: <BarChart3 className="h-6 w-6 text-primary" />,
                title: "Digital Marketing",
                description:
                  "Strategic digital marketing services including social media management, SEO, and targeted advertising campaigns.",
                link: "/services/digital-marketing",
              },
              {
                icon: <Calendar className="h-6 w-6 text-primary" />,
                title: "Event Management",
                description:
                  "End-to-end event planning and execution services for corporate events, conferences, and product launches.",
                link: "/services/event-management",
              },
              {
                icon: <Gamepad2 className="h-6 w-6 text-primary" />,
                title: "Esports Services",
                description:
                  "Tournament organization, player management, and live streaming for competitive gaming events.",
                link: "/esports",
                badge: "Popular",
              },
              {
                icon: <Globe className="h-6 w-6 text-primary" />,
                title: "Global Reach",
                description:
                  "International services with multilingual support and cultural adaptation for worldwide audiences.",
                link: "/services/global-reach",
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                onMouseMove={handleMouseMove}
                className="group"
              >
                <Card className="h-full overflow-hidden hover:scale-105 transition-all duration-300 
                  relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                  before:via-primary/10 before:to-transparent before:-translate-x-full before:rotate-45 
                  before:opacity-0 before:transition-transform before:duration-500 hover:before:translate-x-full 
                  hover:before:opacity-100 after:absolute after:inset-0 
                  after:bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(var(--primary-rgb),0.15),transparent_150px)] 
                  after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100
                  hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/40">
                  <CardContent className="p-6 flex flex-col h-full relative z-10">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 
                      group-hover:bg-primary/20 transition-colors duration-300">
                      {service.icon}
                    </div>
                    <div className="flex items-center mb-3">
                      <h3 className="text-xl font-semibold">{service.title}</h3>
                      {service.badge && (
                        <Badge variant="secondary" className="ml-2">
                          {service.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4 flex-grow">{service.description}</p>
                    <Link
                      href={service.link}
                      className="text-primary hover:text-primary/80 inline-flex items-center font-medium"
                    >
                      Learn more <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Esports Section with Leaderboard */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center-align max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium border-primary/30 bg-primary/5">
              Esports
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text px-6 py-4">Live Tournament Updates</h2>
            <p className="text-muted-foreground">
              Stay updated with live tournament standings and player statistics.
            </p>
          </div>
          <EsportsLeaderboard />
        </div>
      </section>

      {/* Video Streaming Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center-align max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium border-primary/30 bg-primary/5">
              Live Streaming
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text px-6 py-4">Featured Stream</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <VideoPlayer
              src={featuredVideo.url}
              poster="/game.jpg"
              title={featuredVideo.title}
              isLive={featuredVideo.isLive}
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium border-primary/30 bg-primary/5">
                Why Choose Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text px-6 py-4">
                Excellence in Every Digital Experience
              </h2>
              <p className="text-muted-foreground mb-8">
                At NEXUS Studios, we combine creativity, technical expertise, and strategic thinking to deliver
                exceptional digital experiences that drive results for our clients.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <Zap className="h-5 w-5 text-primary" />,
                    title: "Cutting-Edge Technology",
                    description: "We leverage the latest technology to ensure high-quality production and delivery.",
                  },
                  {
                    icon: <Users className="h-5 w-5 text-primary" />,
                    title: "Expert Team",
                    description: "Our team of specialists brings years of industry experience to every project.",
                  },
                  {
                    icon: <Award className="h-5 w-5 text-primary" />,
                    title: "Award-Winning Work",
                    description: "Our portfolio includes recognized and award-winning projects across industries.",
                  },
                  {
                    icon: <TrendingUp className="h-5 w-5 text-primary" />,
                    title: "Results-Driven Approach",
                    description: "We focus on delivering measurable results that align with your business objectives.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-y-1"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/digitalexperiance-logo.jpg?height=1000&width=800&text=Digital%20Excellence"
                  alt="Digital Excellence"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="glass p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-2">Client Success Story</h3>
                    <p className="text-muted-foreground mb-4">
                      "NEXUS Studios transformed our virtual conference into an engaging experience with flawless live
                      streaming and exceptional production quality."
                    </p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/20 mr-3"></div>
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-muted-foreground">TechCorp Inc.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 h-24 w-24 rounded-xl bg-primary/10 -z-10"></div>
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-xl bg-accent/10 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto glass-card p-12 rounded-2xl text-center relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium border-primary/30 bg-primary/5">
                Get Started
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text px-6 py-4">
                Ready to Transform Your Digital Presence?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's work together to bring your vision to life. Contact us today to discuss your project and discover
                how our services can help you achieve your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/services">Explore Services</Link>
                </Button>
              </div>
              
              {/* Newsletter Subscription */}
              <div className="mt-12 max-w-md mx-auto">
                <div className="border border-border/50 rounded-lg p-6 bg-background/50 backdrop-blur-sm">
                  <NewsletterForm 
                    title="Stay Updated"
                    description="Subscribe to our newsletter for the latest news, updates, and insights."
                  />
                </div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-accent/10 blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Fixed Position Components */}


      {/* Floating Chat Button */}
      <div className="fixed bottom-4 right-4 z-50">
        {isChatOpen ? (
          <div className="fixed bottom-20 right-4 w-[400px] h-[600px] bg-background border rounded-lg shadow-lg">
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-muted"
              >
                ✕
              </Button>
            </div>
            <div className="h-full pt-10">
              <Chat />
            </div>
          </div>
        ) : (
          <Button
            size="lg"
            onClick={() => setIsChatOpen(true)}
            className="rounded-full shadow-lg"
          >
            <MessageSquare className="h-6 w-6 mr-2" />
            Chat with AI
          </Button>
        )}
      </div>

      {/* Debug Video Component */}
      <DebugVideo />
    </div>
  )
}

