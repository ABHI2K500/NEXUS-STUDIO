"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function JoinUsPage() {
  const [showApplicationSuccess, setShowApplicationSuccess] = useState(false)

  const jobOpenings = [
    {
      id: "video-producer",
      title: "Video Producer",
      department: "Media Production",
      location: "On-site",
      type: "Full-time",
      description:
        "We're looking for a talented Video Producer to join our Media Production team. The ideal candidate will have experience in producing high-quality video content for various platforms.",
      responsibilities: [
        "Plan and execute video production projects from concept to completion",
        "Collaborate with clients to understand their vision and requirements",
        "Direct and coordinate production crew during shoots",
        "Oversee post-production process including editing, color grading, and sound design",
        "Ensure all deliverables meet quality standards and deadlines",
      ],
      requirements: [
        "3+ years of experience in video production",
        "Proficiency in video editing software (Adobe Premiere Pro, Final Cut Pro)",
        "Strong portfolio demonstrating video production skills",
        "Excellent communication and project management abilities",
        "Bachelor's degree in Film, Media Production, or related field preferred",
      ],
    },
    {
      id: "digital-marketing-specialist",
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description:
        "We're seeking a Digital Marketing Specialist to develop and implement effective digital marketing strategies for our clients. The ideal candidate will have a strong understanding of digital marketing channels and analytics.",
      responsibilities: [
        "Develop and execute digital marketing campaigns across various platforms",
        "Manage social media accounts and create engaging content",
        "Implement SEO strategies to improve client website rankings",
        "Monitor campaign performance and provide detailed reports",
        "Stay updated on digital marketing trends and best practices",
      ],
      requirements: [
        "2+ years of experience in digital marketing",
        "Proficiency in social media management tools and Google Analytics",
        "Experience with SEO, PPC, and email marketing campaigns",
        "Strong analytical skills and data-driven approach",
        "Bachelor's degree in Marketing, Communications, or related field preferred",
      ],
    },
    {
      id: "event-coordinator",
      title: "Event Coordinator",
      department: "Event Management",
      location: "Hybrid",
      type: "Full-time",
      description:
        "We're looking for an Event Coordinator to join our Event Management team. The ideal candidate will have experience in planning and executing various types of events, both virtual and in-person.",
      responsibilities: [
        "Coordinate all aspects of event planning and execution",
        "Liaise with clients, vendors, and internal teams",
        "Manage event budgets and timelines",
        "Oversee on-site event operations",
        "Evaluate event success and provide recommendations for improvement",
      ],
      requirements: [
        "2+ years of experience in event planning and coordination",
        "Strong organizational and multitasking abilities",
        "Excellent communication and negotiation skills",
        "Experience with virtual event platforms",
        "Bachelor's degree in Event Management, Hospitality, or related field preferred",
      ],
    },
    {
      id: "esports-manager",
      title: "Esports Manager",
      department: "Esports",
      location: "On-site",
      type: "Full-time",
      description:
        "We're seeking an Esports Manager to oversee our esports operations and tournaments. The ideal candidate will have a strong understanding of the esports industry and experience in tournament organization.",
      responsibilities: [
        "Plan and execute esports tournaments and events",
        "Manage relationships with players, teams, and sponsors",
        "Oversee tournament operations and ensure fair play",
        "Develop strategies to grow our esports community",
        "Stay updated on industry trends and competitive gaming landscape",
      ],
      requirements: [
        "3+ years of experience in esports management or related field",
        "Strong knowledge of major esports titles and competitive scenes",
        "Experience in tournament organization and operations",
        "Excellent leadership and communication skills",
        "Bachelor's degree preferred, but equivalent experience considered",
      ],
    },
  ]

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920&text=Join%20Our%20Team"
            alt="Join Our Team"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70 backdrop-blur-sm" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl space-y-6 text-center-align">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text neon-glow px-6 py-4">Join Our Team</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're always looking for talented individuals who are passionate about digital media and technology.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center-align max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 gradient-text neon-glow px-6 py-4">Why Join NEXUS Studios?</h2>
            <p className="text-muted-foreground">
              We offer a dynamic work environment where creativity thrives and innovation is encouraged.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovative Projects",
                description: "Work on cutting-edge projects for diverse clients across various industries.",
                image: "/placeholder.svg?height=400&width=400&text=Innovative%20Projects",
              },
              {
                title: "Growth Opportunities",
                description:
                  "Continuous learning and career advancement opportunities to help you reach your full potential.",
                image: "/placeholder.svg?height=400&width=400&text=Growth%20Opportunities",
              },
              {
                title: "Collaborative Culture",
                description:
                  "Join a team of passionate professionals who collaborate, support, and inspire each other.",
                image: "/placeholder.svg?height=400&width=400&text=Collaborative%20Culture",
              },
              {
                title: "Work-Life Balance",
                description: "Flexible work arrangements and policies that promote a healthy work-life balance.",
                image: "/placeholder.svg?height=400&width=400&text=Work-Life%20Balance",
              },
              {
                title: "Competitive Benefits",
                description: "Comprehensive benefits package including health insurance, retirement plans, and more.",
                image: "/placeholder.svg?height=400&width=400&text=Competitive%20Benefits",
              },
              {
                title: "Industry Recognition",
                description: "Be part of an award-winning team recognized for excellence in the industry.",
                image: "/placeholder.svg?height=400&width=400&text=Industry%20Recognition",
              },
            ].map((benefit, index) => (
              <Card key={index} className="overflow-hidden glass-card neon-glow">
                <div className="aspect-square relative">
                  <Image src={benefit.image || "/placeholder.svg"} alt={benefit.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/30 flex items-end backdrop-blur-sm">
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 gradient-text">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center-align max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 gradient-text neon-glow px-6 py-4">Current Openings</h2>
            <p className="text-muted-foreground">
              Explore our current job openings and find the perfect role for your skills and interests.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8 overflow-x-auto pb-2">
              <TabsList className="oval-nav edge-light">
                <TabsTrigger value="all">All Departments</TabsTrigger>
                <TabsTrigger value="media-production">Media Production</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
                <TabsTrigger value="event-management">Event Management</TabsTrigger>
                <TabsTrigger value="esports">Esports</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {jobOpenings.map((job) => (
                  <JobCard key={job.id} job={job} onSuccess={() => setShowApplicationSuccess(true)} />
                ))}
              </div>
            </TabsContent>

            {["media-production", "marketing", "event-management", "esports"].map((department) => (
              <TabsContent key={department} value={department} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {jobOpenings
                    .filter((job) => job.department.toLowerCase().replace(" ", "-") === department)
                    .map((job) => (
                      <JobCard key={job.id} job={job} onSuccess={() => setShowApplicationSuccess(true)} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-12 text-center-align">
            <h3 className="text-xl font-bold mb-4 gradient-text">Don't see the right position?</h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals to join our team. Submit your general application and we'll
              keep you in mind for future opportunities.
            </p>
            <Button size="lg" className="neon-glow">Submit General Application</Button>
          </div>
        </div>
      </section>

      {/* Success Dialog */}
      <Dialog open={showApplicationSuccess} onOpenChange={setShowApplicationSuccess}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="gradient-text">Application Submitted!</DialogTitle>
            <DialogDescription>
              Thank you for your interest in joining our team. We'll review your application and get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowApplicationSuccess(false)} className="neon-glow">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function JobCard({ job, onSuccess }: { job: (typeof jobOpenings)[0]; onSuccess: () => void }) {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <Card className="glass-card neon-glow">
        <CardHeader>
          <CardTitle className="gradient-text">{job.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="neon-glow">
              {job.department}
            </Badge>
            <Badge variant="outline" className="neon-glow">
              {job.location}
            </Badge>
            <Badge variant="outline" className="neon-glow">
              {job.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{job.description}</p>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 gradient-text">Key Responsibilities</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 gradient-text">Requirements</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setShowDialog(true)} className="w-full neon-glow">
            Apply Now
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="gradient-text">Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Please fill out the application form below. We'll review your application and get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" className="glass-card" />
              </div>
              <div>
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" className="glass-card" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="glass-card" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" className="glass-card" />
            </div>
            <div>
              <Label htmlFor="resume">Resume/CV</Label>
              <Input id="resume" type="file" className="glass-card" />
            </div>
            <div>
              <Label htmlFor="cover-letter">Cover Letter</Label>
              <Textarea
                id="cover-letter"
                rows={5}
                placeholder="Tell us why you'd be a great fit for this role..."
                className="glass-card"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowDialog(false)
                onSuccess()
              }}
              className="neon-glow"
            >
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

