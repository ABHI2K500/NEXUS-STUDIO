"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface NewsletterFormProps {
  className?: string
  title?: string
  description?: string
  buttonText?: string
  successMessage?: string
}

export default function NewsletterForm({
  className = "",
  title = "Subscribe to our newsletter",
  description = "Get the latest updates and news delivered to your inbox.",
  buttonText = "Subscribe",
  successMessage = "Thank you for subscribing!"
}: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.trim()) {
      toast.error("Please enter a valid email address")
      return
    }

    setLoading(true)
    console.log("Submitting newsletter subscription for:", email.trim())

    try {
      // Submit to API
      console.log("Sending request to /api/subscribe")
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      })

      console.log("API response status:", response.status)
      
      // Get response data
      const responseData = await response.json().catch(err => {
        console.error("Error parsing response JSON:", err)
        return null
      })
      console.log("API response data:", responseData)

      if (!response.ok) {
        throw new Error(responseData?.message || "Failed to subscribe")
      }

      // Success
      console.log("Subscription successful")
      setSuccess(true)
      setEmail("")
      toast.success(successMessage)

      // Reset success state after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to subscribe"
      
      // If it's already subscribed, show a different message
      if (errorMessage.includes("already subscribed")) {
        toast.info("This email is already subscribed to our newsletter.")
      } else {
        toast.error("Failed to subscribe: " + errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {description && <p className="text-muted-foreground mb-4 text-sm">{description}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-4 w-4" />}
            className="pr-12"
            disabled={loading || success}
            required
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1 h-8"
            disabled={loading || success}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </motion.div>
              ) : loading ? (
                <motion.div
                  key="loading"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="flex items-center"
                >
                  <Mail className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 5, opacity: 0 }}
                  className="flex items-center"
                >
                  {buttonText === "Subscribe" ? <ArrowRight className="h-4 w-4" /> : buttonText}
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </form>
    </div>
  )
} 