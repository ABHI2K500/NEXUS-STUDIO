"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent you a verification link to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-center text-muted-foreground">
            <p>
              Please check your email inbox and click on the verification link to activate your account.
            </p>
            <p>
              If you don't see the email, check your spam folder or request a new verification link.
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button asChild variant="default">
              <Link href="/auth/login">
                Return to Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 