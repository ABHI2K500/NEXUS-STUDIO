import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Video, Camera, BarChart3, Calendar, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Services - ABC Studios",
  description:
    "Explore our comprehensive services including live streaming, media production, digital marketing, event management, and esports.",
}

export default function ServicesPage() {
  const services = [
    {
      icon: <Video className="h-8 w-8" />,
      title: "Live Streaming",
      description:
        "Professional live streaming solutions for virtual and hybrid events with multi-camera setups, graphics, and interactive elements.",
      features: [
        "Multi-camera production",
        "Real-time graphics and overlays",
        "Interactive audience engagement",
        "High-definition streaming",
        "Platform integration (YouTube, Twitch, etc.)",
        "Technical support and monitoring",
      ],
      image: "/Live-Streaming-logo.png?height=720&width=1280&text=Live%20Streaming",
      link: "/services/live-streaming",
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Media Production",
      description:
        "High-quality video and photo production services for commercials, corporate videos, promotional content, and more.",
      features: [
        "Commercial video production",
        "Corporate videos and testimonials",
        "Product photography",
        "Aerial videography and photography",
        "Post-production and editing",
        "Motion graphics and animation",
      ],
      image: "/media-production-logo.jpg?height=720&width=1280&text=Media%20Production",
      link: "/services/media-production",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Digital Marketing",
      description:
        "Strategic digital marketing services to help you reach your target audience, build brand awareness, and drive conversions.",
      features: [
        "Social media management",
        "Search engine optimization (SEO)",
        "Pay-per-click (PPC) advertising",
        "Content marketing",
        "Email marketing campaigns",
        "Analytics and reporting",
      ],
      image: "/digital-marketing-logo.jpg?height=720&width=1280&text=Digital%20Marketing",
      link: "/services/digital-marketing",
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Event Management",
      description:
        "End-to-end event planning and execution services for corporate events, conferences, product launches, and more.",
      features: [
        "Event strategy and planning",
        "Venue selection and management",
        "Speaker and talent coordination",
        "Technical production",
        "On-site management",
        "Post-event analysis",
      ],
      image: "/top-event-management-logo.jpg?height=720&width=1280&text=Event%20Management",
      link: "/services/event-management",
    },
    {
      icon: <Gamepad2 className="h-8 w-8" />,
      title: "Esports Services",
      description:
        "Comprehensive esports solutions including tournament organization, streaming, player management, and more.",
      features: [
        "Tournament organization",
        "Live streaming with commentary",
        "Player profiles and leaderboards",
        "Team management",
        "Sponsorship acquisition",
        "Community building",
      ],
      image: "/esports-tournment-logo.jpg?height=720&width=1280&text=Esports",
      link: "/esports",
    },
  ]

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 z-0">
          <Image
            src="/services.jpg?height=1080&width=1920&text=Our%20Services"
            alt="Our Services"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Our Services</h1>
            <p className="text-xl text-text-200 max-w-2xl">
              Comprehensive digital solutions tailored to your unique needs. From concept to execution, we've got you
              covered.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
            <p className="text-text-200">
              We provide end-to-end solutions across the digital spectrum, helping you connect with your audience and
              achieve your business objectives.
            </p>
          </div>

          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="inline-flex items-center justify-center p-2 bg-primary-300 rounded-lg mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-text-200 mb-6">{service.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-primary-300 flex items-center justify-center mr-2 mt-0.5">
                          <ArrowRight className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild>
                    <Link href={service.link}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div>
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    width={640}
                    height={360}
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-bg-200">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-text-200">
              We follow a structured approach to ensure every project is delivered with excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discovery",
                description:
                  "We start by understanding your goals, audience, and requirements to create a tailored strategy.",
              },
              {
                step: "02",
                title: "Planning",
                description:
                  "Our team develops a comprehensive plan outlining timelines, deliverables, and key milestones.",
              },
              {
                step: "03",
                title: "Execution",
                description: "We bring your vision to life with our technical expertise and creative approach.",
              },
              {
                step: "04",
                title: "Evaluation",
                description: "We measure results, gather feedback, and make adjustments to ensure optimal outcomes.",
              },
            ].map((process, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-primary mb-4">{process.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{process.title}</h3>
                  <p className="text-text-200">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="mb-6">
                  Contact us today to discuss your project and discover how our services can help you achieve your
                  goals.
                </p>
                <Button variant="secondary" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-200/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Custom Solutions</h3>
                  <p className="text-sm">Tailored to your specific needs and objectives</p>
                </div>
                <div className="bg-primary-200/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Expert Team</h3>
                  <p className="text-sm">Skilled professionals with industry experience</p>
                </div>
                <div className="bg-primary-200/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Cutting-Edge Tech</h3>
                  <p className="text-sm">Latest technology and innovative approaches</p>
                </div>
                <div className="bg-primary-200/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Proven Results</h3>
                  <p className="text-sm">Track record of successful projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

