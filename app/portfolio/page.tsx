import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Portfolio - ABC Studios",
  description:
    "Explore our portfolio of live streaming, media production, digital marketing, and event management projects.",
}

const projects = [
  {
    id: "tech-conference-2023",
    title: "Tech Conference 2023",
    category: "live-streaming",
    client: "TechCorp Inc.",
    description: "Multi-day live streaming production for a major tech conference with over 50,000 online viewers.",
    image: "/tech-conference-logo.jpg?height=720&width=1280&text=Tech%20Conference",
  },
  {
    id: "product-launch-video",
    title: "Product Launch Video",
    category: "media-production",
    client: "Innovate Solutions",
    description:
      "High-quality promotional video for a new product launch, featuring cinematic shots and motion graphics.",
    image: "/product-launch-logo.png?height=720&width=1280&text=Product%20Launch",
  },
  {
    id: "digital-marketing-campaign",
    title: "Digital Marketing Campaign",
    category: "digital-marketing",
    client: "Fashion Brand X",
    description: "Comprehensive digital marketing campaign that increased online sales by 150% over three months.",
    image: "/different-types-of-digital-marketing-campaigns-for-businesses.jpg?height=720&width=1280&text=Marketing%20Campaign",
  },
  {
    id: "corporate-event",
    title: "Annual Corporate Event",
    category: "event-management",
    client: "Global Finance",
    description:
      "End-to-end management of a 500-person corporate event, including venue selection, logistics, and production.",
    image: "/corporate-event-logo.jpg?height=720&width=1280&text=Corporate%20Event",
  },
  {
    id: "esports-tournament",
    title: "Regional Esports Tournament",
    category: "esports",
    client: "Gaming League",
    description:
      "Organization and live streaming of a regional esports tournament with 128 participants and 20,000 viewers.",
    image: "/esports-tour-logo.jpg?height=720&width=1280&text=Esports%20Tournament",
  },
  {
    id: "virtual-conference",
    title: "Virtual Healthcare Conference",
    category: "live-streaming",
    client: "Healthcare Association",
    description: "Virtual conference platform with multiple tracks, networking features, and interactive sessions.",
    image: "/virtual-conferance.jpg?height=720&width=1280&text=Virtual%20Conference",
  },
  {
    id: "brand-video",
    title: "Corporate Brand Video",
    category: "media-production",
    client: "Financial Services Inc.",
    description: "Cinematic brand video showcasing the company's history, values, and vision for the future.",
    image: "/corp-brand-video.jpg?height=720&width=1280&text=Brand%20Video",
  },
  {
    id: "social-media-campaign",
    title: "Social Media Campaign",
    category: "digital-marketing",
    client: "Lifestyle Brand",
    description:
      "Influencer-driven social media campaign that reached over 2 million users and drove 30,000 website visits.",
    image: "/Social-media-campaigns.jpg?height=720&width=1280&text=Social%20Media",
  },
  {
    id: "product-launch-event",
    title: "Product Launch Event",
    category: "event-management",
    client: "Tech Startup",
    description: "Hybrid product launch event with in-person and virtual components, reaching a global audience.",
    image: "/product-launch-event.jpg?height=720&width=1280&text=Launch%20Event",
  },
  {
    id: "gaming-championship",
    title: "National Gaming Championship",
    category: "esports",
    client: "Game Publisher",
    description: "National gaming championship with qualifiers, finals, and comprehensive media coverage.",
    image: "/National-gaming-logo.jpg?height=720&width=1280&text=Gaming%20Championship",
  },
]

export default function PortfolioPage() {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 z-0">
          <Image
            src="/portfolio-logo.jpg?height=1080&width=1920&text=Our%20Portfolio"
            alt="Our Portfolio"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Our Portfolio</h1>
            <p className="text-xl text-text-200 max-w-2xl">
              Explore our latest projects and see how we've helped our clients achieve their goals through innovative
              digital solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-16">
        <div className="container">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="live-streaming">Live Streaming</TabsTrigger>
                <TabsTrigger value="media-production">Media Production</TabsTrigger>
                <TabsTrigger value="digital-marketing">Digital Marketing</TabsTrigger>
                <TabsTrigger value="event-management">Event Management</TabsTrigger>
                <TabsTrigger value="esports">Esports</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>

            {["live-streaming", "media-production", "digital-marketing", "event-management", "esports"].map(
              (category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects
                      .filter((project) => project.category === category)
                      .map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                  </div>
                </TabsContent>
              ),
            )}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-bg-200">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-text-200 mb-8">
              Let's work together to bring your vision to life. Contact us today to discuss your project and get
              started.
            </p>
            <Button asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-video">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <Button variant="secondary" size="sm" className="w-full" asChild>
              <Link href={`/portfolio/${project.id}`}>View Project</Link>
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium bg-primary-300 text-primary px-2 py-1 rounded">
            {project.category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </span>
        </div>
        <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
        <p className="text-sm text-text-200 mb-2">Client: {project.client}</p>
        <p className="text-sm text-text-200">{project.description}</p>
      </CardContent>
    </Card>
  )
}

