"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Mail, Send, MessageSquare, LogOut, Calendar, User, AtSign, FileText } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export default function AdminDashboard() {
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([])
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingNewsletter, setSendingNewsletter] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newsletterSubject, setNewsletterSubject] = useState("")
  const [newsletterContent, setNewsletterContent] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const router = useRouter()
  
  useEffect(() => {
    const init = async () => {
      try {
        await checkAuth()
        await fetchData()
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="ghost" onClick={handleSignOut} size="icon" title="Sign Out">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="subscribers">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscribers">
            <Mail className="h-4 w-4 mr-2" />
            Email Subscribers
          </TabsTrigger>
          <TabsTrigger value="contact">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Submissions
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
      </Tabs>
    </div>
  )
} 