"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function ContactPage() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "general",
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log("Submitting contact form with data:", formData)

    try {
      // Prepare data for submission
      const contactData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        message: `Subject: ${formData.subject}\nPhone: ${formData.phone}\n\n${formData.message}`
      }
      console.log("Prepared contact data:", contactData)

      // Submit to API
      console.log("Sending request to /api/contact")
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      })

      console.log("Contact API response status:", response.status)
      
      // Get response data
      const responseData = await response.json().catch(err => {
        console.error("Error parsing contact response JSON:", err)
        return null
      })
      console.log("Contact API response data:", responseData)

      if (!response.ok) {
        throw new Error(responseData?.message || "Failed to submit contact form")
      }

      console.log("Contact form submission successful")
      // Reset form and show success message
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "general",
        message: ""
      })
      setShowSuccess(true)
    } catch (error) {
      console.error("Contact form submission error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to submit contact form")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920&text=Contact%20Us"
            alt="Contact Us"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Contact Us</h1>
            <p className="text-xl text-text-200 max-w-2xl">
              Have a question or want to discuss a project? Get in touch with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-text-200 mb-8">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={handleChange}
                      required 
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={handleChange}
                      required 
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={formData.subject}
                    onValueChange={handleSelectChange}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="live-streaming">Live Streaming Services</SelectItem>
                      <SelectItem value="media-production">Media Production</SelectItem>
                      <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                      <SelectItem value="event-management">Event Management</SelectItem>
                      <SelectItem value="esports">Esports Services</SelectItem>
                      <SelectItem value="careers">Careers</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    rows={6} 
                    required 
                    placeholder="Tell us about your project or inquiry..." 
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>

              <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Message Sent!</DialogTitle>
                    <DialogDescription>
                      Thank you for contacting Nexus Studios. We've received your message and will get back to you within
                      24-48 hours.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-text-200 mb-8">
                You can also reach us using the information below or visit our office.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary-300 flex items-center justify-center mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <a href="mailto:info@nexusstudios.com" className="text-primary hover:underline">
                      info@nexusstudios.com
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary-300 flex items-center justify-center mb-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <a href="tel:+11234567890" className="text-primary hover:underline">
                      +1 (123) 456-7890
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary-300 flex items-center justify-center mb-4">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <address className="not-italic text-text-200">
                      123 Digital Avenue
                      <br />
                      Tech City, TC 12345
                      <br />
                      United States
                    </address>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary-300 flex items-center justify-center mb-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Business Hours</h3>
                    <p className="text-text-200">
                      Monday - Friday
                      <br />
                      9:00 AM - 6:00 PM EST
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-lg overflow-hidden h-[400px] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059353029!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sca!4v1623252076075!5m2!1sen!2sca"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Nexus Studios Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-bg-200">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-text-200">Find answers to common questions about our services and processes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "What services does ABC Studios offer?",
                answer:
                  "ABC Studios offers a comprehensive range of digital services including live streaming, media production, digital marketing, event management, and esports services. We provide end-to-end solutions tailored to your specific needs.",
              },
              {
                question: "How much do your services cost?",
                answer:
                  "Our service costs vary depending on the scope, complexity, and specific requirements of each project. We provide customized quotes after an initial consultation to understand your needs. Contact us for a free quote.",
              },
              {
                question: "What is your typical turnaround time for projects?",
                answer:
                  "Turnaround times vary based on the type and scope of the project. Small projects may take a few days, while larger, more complex projects could take several weeks or months. We'll provide a detailed timeline during our initial consultation.",
              },
              {
                question: "Do you work with clients outside of your location?",
                answer:
                  "Yes, we work with clients globally. Many of our services can be delivered remotely, and we have experience managing projects for clients across different time zones and locations.",
              },
              {
                question: "What equipment do you use for live streaming?",
                answer:
                  "We use professional-grade equipment for all our live streaming productions, including high-definition cameras, professional audio equipment, lighting, and reliable streaming hardware and software. Our setup is customized based on the specific requirements of each event.",
              },
              {
                question: "How do I register for an esports tournament?",
                answer:
                  "You can register for our esports tournaments through the Esports page on our website. Each tournament has specific registration requirements, fees, and deadlines. Visit our Esports page for more information on upcoming tournaments.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-text-200">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

