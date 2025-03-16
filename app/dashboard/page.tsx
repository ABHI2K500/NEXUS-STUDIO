"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { LogOut, User, Activity, FileText } from "lucide-react"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient()
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }
        
        if (!session) {
          // Redirect to login if no session
          router.push("/auth/login")
          return
        }
        
        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          
        if (profileError) {
          throw profileError
        }
        
        setUser({
          ...session.user,
          ...profile
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Failed to load user data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [router])
  
  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      toast.success("Signed out successfully")
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out")
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* User Profile Card */}
          <Card className="w-full md:w-1/3">
            <CardHeader className="pb-2">
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar_url} alt={user?.email} />
                  <AvatarFallback className="text-2xl">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-medium">{user?.full_name || "User"}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium capitalize">{user?.role || "User"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since:</span>
                  <span className="font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
          
          {/* Dashboard Content */}
          <div className="w-full md:w-2/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>View your activity and content</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="activity">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="activity">
                      <Activity className="mr-2 h-4 w-4" />
                      Activity
                    </TabsTrigger>
                    <TabsTrigger value="content">
                      <FileText className="mr-2 h-4 w-4" />
                      Content
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="activity" className="mt-6">
                    <div className="rounded-lg border bg-card p-6">
                      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-md bg-muted/50">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Profile created</p>
                            <p className="text-sm text-muted-foreground">
                              {user?.created_at ? new Date(user.created_at).toLocaleString() : "N/A"}
                            </p>
                          </div>
                        </div>
                        
                        {/* Placeholder for future activity items */}
                        <p className="text-center text-muted-foreground py-4">
                          No recent activity to display
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="content" className="mt-6">
                    <div className="rounded-lg border bg-card p-6">
                      <h3 className="text-lg font-medium mb-4">Your Content</h3>
                      
                      {/* Placeholder for future content items */}
                      <div className="text-center text-muted-foreground py-8">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>You haven't created any content yet</p>
                        <Button variant="outline" className="mt-4">
                          Create New Content
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 