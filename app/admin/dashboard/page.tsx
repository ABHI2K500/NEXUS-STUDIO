"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Mail, Send, MessageSquare, LogOut, Calendar, User, AtSign, FileText, Video, CheckCircle, Trophy, Plus, Trash2, Edit, Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import styles from "./styles.module.css"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useVideoUpdate } from "@/components/video-update-provider"

type EmailSubscriber = {
  id: string
  email: string
  created_at: string
}

type ContactSubmission = {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

// Add new type for featured video
type FeaturedVideo = {
  url: string
  title: string
  isLive: boolean
}

// Add new type for leaderboard player
type LeaderboardPlayer = {
  id: string
  name: string
  rank: number
  score: number
  avatar: string
  team: string
  stats: {
    wins: number
    losses: number
    winRate: number
    avgScore: number
  }
}

export default function AdminDashboard() {
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([])
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingNewsletter, setSendingNewsletter] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newsletterSubject, setNewsletterSubject] = useState("")
  const [newsletterContent, setNewsletterContent] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { showVideoUpdateNotification } = useVideoUpdate()
  
  // Add state for featured video
  const [featuredVideo, setFeaturedVideo] = useState<FeaturedVideo>({
    url: "https://www.youtube.com/watch?v=bJ5ClftUcBI",
    title: "Live Tournament Stream",
    isLive: true
  })
  const [updatingVideo, setUpdatingVideo] = useState(false)

  // Add state for leaderboard
  const [leaderboardPlayers, setLeaderboardPlayers] = useState<LeaderboardPlayer[]>([])
  const [editingPlayer, setEditingPlayer] = useState<LeaderboardPlayer | null>(null)
  const [isEditingLeaderboard, setIsEditingLeaderboard] = useState(false)
  const [updatingLeaderboard, setUpdatingLeaderboard] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        await checkAuth()
        await fetchData()
        await fetchFeaturedVideo()
        await fetchLeaderboard()
      } catch (err) {
        console.error("Dashboard initialization error:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to initialize dashboard"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }
    
    init()
  }, [])

  const checkAuth = async () => {
    try {
      console.log("Checking authentication for dashboard")
      const supabase = createClient()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error("Session error:", sessionError)
        throw sessionError
      }
      
      if (!session) {
        console.log("No session found, redirecting to login")
        router.push("/auth/login?isAdmin=true")
        throw new Error("Authentication required")
      }
      
      console.log("Session found for user:", session.user.id)

      // Check if user has admin role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (profileError) {
        console.error("Profile error:", profileError)
        throw profileError
      }
      
      console.log("Profile found:", profile)

      if (profile?.role !== "admin") {
        console.log("User is not an admin, signing out")
        await supabase.auth.signOut()
        router.push("/auth/login?isAdmin=true")
        throw new Error("Admin privileges required")
      }
      
      console.log("Admin access confirmed")

      setUser(session.user)
    } catch (err) {
      console.error("Auth check error:", err)
      throw err
    }
  }

  const fetchData = async () => {
    try {
      console.log("Fetching dashboard data")
      const supabase = createClient()
      
      // Fetch email subscribers
      console.log("Fetching email subscribers")
      const { data: subscribersData, error: subscribersError } = await supabase
        .from("email_subscribers")
        .select("*")
        .order("created_at", { ascending: false })

      if (subscribersError) {
        console.error("Subscribers fetch error:", subscribersError)
        throw subscribersError
      }
      
      console.log(`Found ${subscribersData?.length || 0} subscribers:`, subscribersData)
      setSubscribers(subscribersData || [])

      // Fetch contact form submissions
      console.log("Fetching contact submissions")
      const { data: contactData, error: contactError } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })

      if (contactError) {
        console.error("Contact submissions fetch error:", contactError)
        throw contactError
      }
      
      console.log(`Found ${contactData?.length || 0} contact submissions:`, contactData)
      setContactSubmissions(contactData || [])
      
      // If no data was found, check if tables exist
      if ((!subscribersData || subscribersData.length === 0) && 
          (!contactData || contactData.length === 0)) {
        console.log("No data found, checking if tables exist")
        
        // Check if tables exist
        console.log("Checking if email_subscribers table exists")
        const { data: tableData, error: tableError } = await supabase
          .from("email_subscribers")
          .select("count")
          .limit(1)
          
        if (tableError) {
          console.error("Table check error:", tableError)
          toast.error("Database tables may not be set up correctly. Please run the migration scripts.")
        } else {
          console.log("Table check result:", tableData)
        }
      }
    } catch (error) {
      console.error("Data fetch error:", error)
      throw error
    }
  }

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
      
      // Use replace instead of push to prevent back navigation
      router.replace("/auth/login")
      
      // Fallback if router doesn't trigger navigation
      setTimeout(() => {
        window.location.href = "/auth/login"
      }, 500)
      
      toast.success("Signed out successfully")
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Failed to sign out")
    }
  }

  const sendNewsletter = async () => {
    if (!newsletterSubject.trim()) {
      toast.error("Please enter a newsletter subject")
      return
    }
    
    if (!newsletterContent.trim()) {
      toast.error("Please enter newsletter content")
      return
    }
    
    setSendingNewsletter(true)
    try {
      const supabase = createClient()
      const response = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails: subscribers.map(s => s.email),
          subject: newsletterSubject,
          content: newsletterContent
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || "Failed to send newsletter")
      }

      toast.success("Newsletter sent successfully!")
      setNewsletterSubject("")
      setNewsletterContent("")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send newsletter"
      toast.error(errorMessage)
      console.error(error)
    } finally {
      setSendingNewsletter(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // Add function to fetch featured video
  const fetchFeaturedVideo = async () => {
    try {
      const response = await fetch("/api/video", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log("Fetched video data:", data);
        setFeaturedVideo(data);
      } else {
        console.error("Error fetching featured video:", data.error);
      }
    } catch (error) {
      console.error("Error fetching featured video:", error);
    }
  }
  
  // Add function to extract YouTube video ID
  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // Add function to update featured video
  const updateFeaturedVideo = async () => {
    try {
      setUpdatingVideo(true);
      
      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify(featuredVideo),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Extract YouTube video ID for preview
        const youtubeID = getYouTubeID(featuredVideo.url);
        
        // Show a more prominent success message
        toast.success(
          <div className="flex flex-col space-y-2">
            <div className="font-medium">Video Updated Successfully!</div>
            <div className="text-sm text-muted-foreground">
              <div><strong>Title:</strong> {featuredVideo.title}</div>
              <div><strong>URL:</strong> {featuredVideo.url}</div>
              <div><strong>Live Status:</strong> {featuredVideo.isLive ? "Live" : "Not Live"}</div>
            </div>
            <div className="text-xs mt-1">
              Changes will be visible on the homepage immediately.
            </div>
          </div>,
          {
            duration: 5000,
            className: styles["video-update-toast"],
            position: "top-center",
            icon: <CheckCircle className="h-5 w-5 text-green-500" />
          }
        );
        
        // Trigger the global notification that will appear on all pages
        showVideoUpdateNotification(featuredVideo.url, featuredVideo.title, featuredVideo.isLive);
        
        // Add a custom dialog to show the update was successful
        const dialog = document.createElement('dialog');
        dialog.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4';
        
        // Create HTML for the dialog
        const videoPreviewHtml = youtubeID ? 
          `<div class="aspect-video mb-4 rounded-md overflow-hidden">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/${youtubeID}?autoplay=0" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>` : '';
        
        dialog.innerHTML = `
          <div class="${styles['fade-in']} ${styles['zoom-in']} bg-background rounded-lg shadow-lg max-w-md w-full p-6">
            <div class="flex items-center space-x-2 mb-4">
              <div class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 class="text-lg font-medium">Video Updated Successfully!</h3>
            </div>
            
            ${videoPreviewHtml}
            
            <div class="space-y-3 mb-4">
              <div class="p-3 bg-muted rounded-md">
                <div class="mb-1"><span class="font-medium">Title:</span> ${featuredVideo.title}</div>
                <div class="mb-1 break-all"><span class="font-medium">URL:</span> ${featuredVideo.url}</div>
                <div><span class="font-medium">Status:</span> ${featuredVideo.isLive ? 
                  '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">LIVE</span>' : 
                  '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Not Live</span>'
                }</div>
              </div>
              <p class="text-sm text-muted-foreground">
                The featured video has been updated and will be visible on the homepage immediately.
              </p>
            </div>
            <div class="flex justify-end">
              <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium" id="closeDialog">
                Close
              </button>
            </div>
          </div>
        `;
        
        document.body.appendChild(dialog);
        dialog.showModal();
        
        // Add event listener to close button
        const closeButton = dialog.querySelector('#closeDialog');
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            const modalContent = dialog.querySelector('div');
            if (modalContent) {
              modalContent.classList.remove(styles['fade-in'], styles['zoom-in']);
              modalContent.classList.add(styles['fade-out'], styles['zoom-out']);
            }
            setTimeout(() => {
              dialog.close();
              document.body.removeChild(dialog);
            }, 300);
          });
        }
        
        // Auto close after 8 seconds
        setTimeout(() => {
          if (document.body.contains(dialog)) {
            const modalContent = dialog.querySelector('div');
            if (modalContent) {
              modalContent.classList.remove(styles['fade-in'], styles['zoom-in']);
              modalContent.classList.add(styles['fade-out'], styles['zoom-out']);
            }
            setTimeout(() => {
              if (document.body.contains(dialog)) {
                dialog.close();
                document.body.removeChild(dialog);
              }
            }, 300);
          }
        }, 8000);
      } else {
        toast.error(`Error updating featured video: ${data.error}`)
      }
    } catch (error: any) {
      toast.error(`Error updating featured video: ${error.message}`)
    } finally {
      setUpdatingVideo(false)
    }
  }

  // Add function to fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      
      const data = await response.json();
      setLeaderboardPlayers(data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      toast.error("Failed to fetch leaderboard data");
    }
  }

  // Add function to update leaderboard
  const updateLeaderboard = async () => {
    try {
      setUpdatingLeaderboard(true);
      
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify(leaderboardPlayers),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update leaderboard");
      }
      
      const data = await response.json();
      setLeaderboardPlayers(data.data);
      setIsEditingLeaderboard(false);
      setEditingPlayer(null);
      
      toast.success("Leaderboard updated successfully");
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      toast.error("Failed to update leaderboard");
    } finally {
      setUpdatingLeaderboard(false);
    }
  }

  // Add function to add a new player
  const addNewPlayer = () => {
    const newPlayer: LeaderboardPlayer = {
      id: Date.now().toString(),
      name: "New Player",
      rank: leaderboardPlayers.length + 1,
      score: 1000,
      avatar: "/avatars/default.png",
      team: "Team New",
      stats: {
        wins: 0,
        losses: 0,
        winRate: 0,
        avgScore: 0
      }
    };
    
    setLeaderboardPlayers([...leaderboardPlayers, newPlayer]);
    setEditingPlayer(newPlayer);
    setIsEditingLeaderboard(true);
  }

  // Add function to remove a player
  const removePlayer = (id: string) => {
    setLeaderboardPlayers(leaderboardPlayers.filter(player => player.id !== id));
    if (editingPlayer?.id === id) {
      setEditingPlayer(null);
    }
  }

  // Add function to update player data
  const updatePlayerData = (field: string, value: string | number | boolean) => {
    if (!editingPlayer) return;
    
    if (field.startsWith('stats.')) {
      const statField = field.split('.')[1];
      setEditingPlayer({
        ...editingPlayer,
        stats: {
          ...editingPlayer.stats,
          [statField]: value
        }
      });
    } else {
      setEditingPlayer({
        ...editingPlayer,
        [field]: value
      });
    }
  }

  // Add function to save player edits
  const savePlayerEdits = () => {
    if (!editingPlayer) return;
    
    setLeaderboardPlayers(leaderboardPlayers.map(player => 
      player.id === editingPlayer.id ? editingPlayer : player
    ));
    
    setEditingPlayer(null);
  }

  // Add function to calculate win rate
  const calculateWinRate = (wins: number, losses: number) => {
    if (wins + losses === 0) return 0;
    return parseFloat(((wins / (wins + losses)) * 100).toFixed(1));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {user && <p className="text-muted-foreground">Logged in as {user.email}</p>}
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      ) : (
        <Tabs defaultValue="subscribers">
          <TabsList className="mb-8">
            <TabsTrigger value="subscribers">
              <Mail className="h-4 w-4 mr-2" />
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="contact">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Submissions
            </TabsTrigger>
            <TabsTrigger value="newsletter">
              <Send className="h-4 w-4 mr-2" />
              Send Newsletter
            </TabsTrigger>
            <TabsTrigger value="featured-video">
              <Video className="h-4 w-4 mr-2" />
              Featured Video
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Trophy className="h-4 w-4 mr-2" />
              Esports Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscribers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Subscribers</CardTitle>
                <CardDescription>
                  You have {subscribers.length} email subscribers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscribers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No subscribers yet
                    </p>
                  ) : (
                    <Table>
                      <TableCaption>List of email subscribers</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Subscription Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribers.map((subscriber) => (
                          <TableRow key={subscriber.id}>
                            <TableCell className="font-medium">{subscriber.email}</TableCell>
                            <TableCell>{formatDate(subscriber.created_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Form Submissions</CardTitle>
                <CardDescription>
                  You have {contactSubmissions.length} contact form submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contactSubmissions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No contact form submissions yet
                  </p>
                ) : (
                  <Table>
                    <TableCaption>List of contact form submissions</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">{submission.name}</TableCell>
                          <TableCell>{submission.email}</TableCell>
                          <TableCell>{formatDate(submission.created_at)}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedSubmission(submission)}
                                >
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Contact Submission Details</DialogTitle>
                                  <DialogDescription>
                                    Submitted on {selectedSubmission && formatDate(selectedSubmission.created_at)}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="flex items-center gap-4">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Name</p>
                                      <p>{selectedSubmission?.name}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <AtSign className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Email</p>
                                      <p>{selectedSubmission?.email}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-4">
                                    <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                                    <div>
                                      <p className="text-sm font-medium">Message</p>
                                      <p className="whitespace-pre-wrap">{selectedSubmission?.message}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={`mailto:${selectedSubmission?.email}`}>
                                      Reply via Email
                                    </a>
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter">
            <Card>
              <CardHeader>
                <CardTitle>Send Newsletter</CardTitle>
                <CardDescription>
                  Compose and send a newsletter to all subscribers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Newsletter Subject"
                      value={newsletterSubject}
                      onChange={(e) => setNewsletterSubject(e.target.value)}
                      disabled={sendingNewsletter}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your newsletter content here..."
                      rows={10}
                      value={newsletterContent}
                      onChange={(e) => setNewsletterContent(e.target.value)}
                      disabled={sendingNewsletter}
                      className="min-h-[200px]"
                    />
                    <p className="text-sm text-muted-foreground">
                      You can use HTML tags for formatting.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={sendNewsletter} 
                  disabled={sendingNewsletter || subscribers.length === 0}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sendingNewsletter ? "Sending..." : "Send Newsletter"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="featured-video">
            <Card>
              <CardHeader>
                <CardTitle>Manage Featured Video</CardTitle>
                <CardDescription>
                  Update the featured video displayed on the homepage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-url">Video URL</Label>
                    <Input
                      id="video-url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={featuredVideo.url}
                      onChange={(e) => setFeaturedVideo({ ...featuredVideo, url: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter a YouTube video URL (e.g., https://www.youtube.com/watch?v=bJ5ClftUcBI)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="video-title">Video Title</Label>
                    <Input
                      id="video-title"
                      placeholder="Live Tournament Stream"
                      value={featuredVideo.title}
                      onChange={(e) => setFeaturedVideo({ ...featuredVideo, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="live-status"
                      checked={featuredVideo.isLive}
                      onCheckedChange={(checked) => setFeaturedVideo({ ...featuredVideo, isLive: checked })}
                    />
                    <Label htmlFor="live-status">Mark as Live Stream</Label>
                  </div>
                  
                  {/* Video Preview */}
                  {featuredVideo.url && (
                    <div className="mt-6 space-y-2">
                      <Label>Video Preview</Label>
                      <div className="aspect-video rounded-md overflow-hidden border">
                        {getYouTubeID(featuredVideo.url) ? (
                          <iframe 
                            width="100%" 
                            height="100%" 
                            src={`https://www.youtube.com/embed/${getYouTubeID(featuredVideo.url)}?autoplay=0`}
                            title="YouTube video preview" 
                            frameBorder="0" 
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <p className="text-muted-foreground">Invalid YouTube URL</p>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This is how the video will appear on the homepage
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={updateFeaturedVideo} disabled={updatingVideo}>
                  {updatingVideo ? "Updating..." : "Update Featured Video"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Esports Leaderboard</CardTitle>
                    <CardDescription>
                      Update player information and scores for the esports leaderboard
                    </CardDescription>
                  </div>
                  <Button onClick={addNewPlayer} disabled={updatingLeaderboard}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Player
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardPlayers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No players in the leaderboard</p>
                      <Button onClick={addNewPlayer} className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Player
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Player List */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium mb-2">Players</h3>
                          {leaderboardPlayers
                            .sort((a, b) => b.score - a.score)
                            .map((player, index) => (
                              <div 
                                key={player.id}
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                  editingPlayer?.id === player.id ? 'border-primary' : 'border-border'
                                } hover:bg-accent/5 transition-colors cursor-pointer`}
                                onClick={() => setEditingPlayer(player)}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-medium">{player.name}</p>
                                    <p className="text-sm text-muted-foreground">{player.team}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="text-right mr-2">
                                    <p className="font-bold">{player.score}</p>
                                    <p className="text-xs text-muted-foreground">points</p>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removePlayer(player.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                        
                        {/* Player Edit Form */}
                        <div>
                          {editingPlayer ? (
                            <div className="border rounded-lg p-4 space-y-4">
                              <h3 className="text-lg font-medium mb-2">Edit Player</h3>
                              
                              <div className="space-y-2">
                                <Label htmlFor="player-name">Player Name</Label>
                                <Input
                                  id="player-name"
                                  value={editingPlayer.name}
                                  onChange={(e) => updatePlayerData('name', e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="player-team">Team</Label>
                                <Input
                                  id="player-team"
                                  value={editingPlayer.team}
                                  onChange={(e) => updatePlayerData('team', e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="player-score">Score</Label>
                                <Input
                                  id="player-score"
                                  type="number"
                                  value={editingPlayer.score}
                                  onChange={(e) => updatePlayerData('score', parseInt(e.target.value) || 0)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="player-avatar">Avatar URL</Label>
                                <Input
                                  id="player-avatar"
                                  value={editingPlayer.avatar}
                                  onChange={(e) => updatePlayerData('avatar', e.target.value)}
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="player-wins">Wins</Label>
                                  <Input
                                    id="player-wins"
                                    type="number"
                                    value={editingPlayer.stats.wins}
                                    onChange={(e) => {
                                      const wins = parseInt(e.target.value) || 0;
                                      updatePlayerData('stats.wins', wins);
                                      updatePlayerData('stats.winRate', calculateWinRate(wins, editingPlayer.stats.losses));
                                    }}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="player-losses">Losses</Label>
                                  <Input
                                    id="player-losses"
                                    type="number"
                                    value={editingPlayer.stats.losses}
                                    onChange={(e) => {
                                      const losses = parseInt(e.target.value) || 0;
                                      updatePlayerData('stats.losses', losses);
                                      updatePlayerData('stats.winRate', calculateWinRate(editingPlayer.stats.wins, losses));
                                    }}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="player-winrate">Win Rate (%)</Label>
                                  <Input
                                    id="player-winrate"
                                    type="number"
                                    value={editingPlayer.stats.winRate}
                                    onChange={(e) => updatePlayerData('stats.winRate', parseFloat(e.target.value) || 0)}
                                    step="0.1"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="player-avgscore">Avg Score</Label>
                                  <Input
                                    id="player-avgscore"
                                    type="number"
                                    value={editingPlayer.stats.avgScore}
                                    onChange={(e) => updatePlayerData('stats.avgScore', parseInt(e.target.value) || 0)}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex justify-end space-x-2 pt-2">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setEditingPlayer(null)}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={savePlayerEdits}>
                                  <Save className="h-4 w-4 mr-2" />
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="border rounded-lg p-4 flex items-center justify-center h-full">
                              <div className="text-center">
                                <p className="text-muted-foreground mb-4">Select a player to edit their details</p>
                                <Button variant="outline" onClick={addNewPlayer}>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add New Player
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={updateLeaderboard} 
                  disabled={updatingLeaderboard}
                  className="w-full"
                >
                  {updatingLeaderboard ? "Updating..." : "Update Leaderboard"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 