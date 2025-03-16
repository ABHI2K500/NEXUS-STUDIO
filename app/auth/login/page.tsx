"use client"

import { useState, useEffect, useRef, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isAdmin: z.boolean().default(false),
})

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

// Component that uses useSearchParams
function SearchParamsWrapper({ children }: { children: (params: URLSearchParams | null) => React.ReactNode }) {
  const searchParams = useSearchParams()
  return <>{children(searchParams)}</>
}

// Custom hook to handle search params
function useSearchParamsHandler(onParamsChange: (params: URLSearchParams | null) => void) {
  return useCallback((params: URLSearchParams | null) => {
    onParamsChange(params)
    return null
  }, [onParamsChange])
}

export default function AuthPage() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const isAdminParamRef = useRef(false)
  const redirectToRef = useRef("/dashboard")
  
  // Initialize the form first
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      isAdmin: false,
    },
  })
  
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  
  // Handle error messages from URL parameters
  const handleErrorParam = (errorParam: string | null) => {
    if (errorParam) {
      let errorMessage = "An error occurred during authentication"
      
      switch (errorParam) {
        case "auth_callback_error":
          errorMessage = "Authentication failed. Please try again."
          break
        case "auth_exception":
          errorMessage = "An unexpected error occurred. Please try again."
          break
        case "unauthorized":
          errorMessage = "Unauthorized access. Admin privileges required."
          break
      }
      
      setError(errorMessage)
    }
  }
  
  // Handle search params changes
  const handleSearchParamsChange = useCallback((params: URLSearchParams | null) => {
    const redirectTo = params?.get("redirectTo") || "/dashboard"
    const isAdminParam = params?.get("isAdmin") === "true"
    const errorParam = params?.get("error") || null
    
    // Update the ref values
    isAdminParamRef.current = isAdminParam
    redirectToRef.current = redirectTo
    
    // Handle error parameter
    handleErrorParam(errorParam)
    
    // Update isAdmin in the form
    if (isAdminParam) {
      loginForm.setValue("isAdmin", true)
    }
  }, [loginForm])
  
  const searchParamsHandler = useSearchParamsHandler(handleSearchParamsChange)
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("Session check error:", sessionError)
          return
        }
        
        if (session) {
          console.log("Session found:", session.user.id)
          // Check user role to determine redirect
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()

          if (profileError) {
            console.error("Profile check error:", profileError)
            return
          }

          if (profile?.role === "admin") {
            router.push("/admin/dashboard")
          } else {
            router.push("/dashboard")
          }
        }
      } catch (err) {
        console.error("Session check exception:", err)
      }
    }
    
    checkSession()
  }, [router])

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (signInError) {
        throw signInError
      }

      if (data.user) {
        // Check user role to determine redirect
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          throw profileError
        }

        // If admin login is checked but user is not an admin
        if (values.isAdmin && profile?.role !== "admin") {
          await supabase.auth.signOut()
          throw new Error("Unauthorized access. Admin privileges required.")
        }

        toast.success("Login successful!")
        
        if (profile?.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          // Use the redirectTo from SearchParamsWrapper
          router.push(redirectToRef.current)
        }
      } else {
        throw new Error("Login failed. Please try again.")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to login"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (values: SignupFormValues) => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (data.user) {
        // Create a profile record with default user role
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            email: values.email,
            role: "user",
            created_at: new Date().toISOString(),
          })

        if (profileError) {
          throw profileError
        }

        toast.success("Account created! Please check your email to verify your account.")
        router.push("/auth/verify")
      } else {
        throw new Error("Signup failed. Please try again.")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create account"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome to Nexus
            </CardTitle>
            <CardDescription className="text-center">
              Loading...
            </CardDescription>
          </CardHeader>
        </Card>
      }>
        <SearchParamsWrapper>
          {(searchParams) => {
            // Process search params and return null to avoid rendering issues
            searchParamsHandler(searchParams)
            
            return (
              <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">
                    {isAdminParamRef.current ? "Admin Login" : "Welcome to Nexus"}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {isAdminParamRef.current 
                      ? "Enter your credentials to access the admin dashboard" 
                      : "Sign in to your account or create a new one"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="signup" disabled={isAdminParamRef.current}>Sign Up</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login">
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="your.email@example.com" 
                                    type="email" 
                                    disabled={loading} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="••••••••" 
                                    type="password" 
                                    disabled={loading} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {!isAdminParamRef.current && (
                            <FormField
                              control={loginForm.control}
                              name="isAdmin"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={loading}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Admin Login</FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                      Check this if you are logging in as an administrator
                                    </p>
                                  </div>
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                          >
                            {loading ? "Logging in..." : isAdminParamRef.current ? "Admin Login" : "Login"}
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                    
                    <TabsContent value="signup">
                      <Form {...signupForm}>
                        <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                          <FormField
                            control={signupForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="your.email@example.com" 
                                    type="email" 
                                    disabled={loading} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={signupForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="••••••••" 
                                    type="password" 
                                    disabled={loading} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={signupForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="••••••••" 
                                    type="password" 
                                    disabled={loading} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="text-sm text-muted-foreground">
                            <p>Note: New accounts are created with regular user permissions.</p>
                            <p>Admin access requires approval from existing administrators.</p>
                          </div>
                          
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                          >
                            {loading ? "Creating account..." : "Create Account"}
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )
          }}
        </SearchParamsWrapper>
      </Suspense>
    </div>
  )
} 