import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { BlogSearch } from "./blog-search"

export const metadata = {
  title: "Blog - ABC Studios",
  description:
    "Read the latest articles, insights, and updates from ABC Studios on digital marketing, live streaming, media production, and more.",
}

const blogPosts = [
  {
    id: "future-of-live-streaming",
    title: "The Future of Live Streaming in 2023 and Beyond",
    excerpt:
      "Explore the emerging trends and technologies shaping the future of live streaming and how businesses can leverage them.",
    category: "Live Streaming",
    author: "Alex Johnson",
    date: "June 15, 2023",
    readTime: "8 min read",
    image: "/placeholder.svg?height=720&width=1280&text=Live%20Streaming%20Future",
    featured: true,
  },
  {
    id: "digital-marketing-strategies",
    title: "5 Digital Marketing Strategies That Actually Work",
    excerpt:
      "Cut through the noise with these proven digital marketing strategies that deliver real results for businesses of all sizes.",
    category: "Digital Marketing",
    author: "Maria Rodriguez",
    date: "May 28, 2023",
    readTime: "6 min read",
    image: "/placeholder.svg?height=720&width=1280&text=Marketing%20Strategies",
    featured: true,
  },
  {
    id: "virtual-events-guide",
    title: "The Complete Guide to Planning Successful Virtual Events",
    excerpt:
      "Learn how to plan, execute, and evaluate virtual events that engage your audience and achieve your business objectives.",
    category: "Event Management",
    author: "James Wilson",
    date: "May 12, 2023",
    readTime: "10 min read",
    image: "/placeholder.svg?height=720&width=1280&text=Virtual%20Events",
    featured: true,
  },
  {
    id: "video-production-tips",
    title: "10 Professional Video Production Tips for Beginners",
    excerpt:
      "Elevate your video content with these professional tips that don't require expensive equipment or years of experience.",
    category: "Media Production",
    author: "Samantha Lee",
    date: "April 30, 2023",
    readTime: "7 min read",
    image: "/placeholder.svg?height=720&width=1280&text=Video%20Production",
  },
  {
    id: "esports-marketing",
    title: "How Brands Can Effectively Enter the Esports Market",
    excerpt:
      "A strategic guide for brands looking to tap into the growing esports industry and connect with its passionate audience.",
    category: "Esports",
    author: "Thomas Wright",
    date: "April 18, 2023",
    readTime: "9 min read",
    image: "/placeholder.svg?height=720&width=1280&text=Esports%20Marketing",
  },
  {
    id: "social-media-trends",
    title: "Social Media Trends to Watch in 2023",
    excerpt:
      "Stay ahead of the curve with these emerging social media trends that are reshaping how brands connect with their audiences.",
    category: "Digital Marketing",
    author: "Priya Patel",
    date: "April 5, 2023",
    readTime: "5 min read",
    image: "/placeholder.svg?height=720&width=1280&text=Social%20Media%20Trends",
  },
  {
    id: "hybrid-events",
    title: "Mastering the Art of Hybrid Events",
    excerpt:
      "Discover how to create seamless experiences that engage both in-person and virtual attendees at hybrid events.",
    category: "Event Management",
    author: "James Wilson",
    date: "March 22, 2023",
    readTime: "8 min read",
    image: "/placeholder.svg?height=720&width=1280&text=Hybrid%20Events",
  },
  {
    id: "content-creation",
    title: "The Science of Creating Shareable Content",
    excerpt:
      "Understand the psychological principles behind content that gets shared and how to apply them to your content strategy.",
    category: "Digital Marketing",
    author: "Maria Rodriguez",
    date: "March 10, 2023",
    readTime: "7 min read",
    image: "/placeholder.svg?height=720&width=1280&text=Content%20Creation",
  },
  {
    id: "gaming-industry",
    title: "The Evolution of the Gaming Industry: From Arcades to Esports",
    excerpt: "A look at how gaming has evolved over the decades and the rise of esports as a global phenomenon.",
    category: "Esports",
    author: "Thomas Wright",
    date: "February 28, 2023",
    readTime: "11 min read",
    image: "/placeholder.svg?height=720&width=1280&text=Gaming%20Industry",
  },
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 z-0">
          <Image src="/placeholder.svg?height=1080&width=1920&text=Blog" alt="Blog" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Our Blog</h1>
            <p className="text-xl text-text-200 max-w-2xl">
              Insights, tips, and updates from our team of experts on all things digital media.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <Card key={post.id} className={`overflow-hidden ${index === 0 ? "lg:col-span-3" : ""}`}>
                <div className={`grid ${index === 0 ? "lg:grid-cols-2" : "grid-cols-1"} gap-0`}>
                  <div className={`relative ${index === 0 ? "aspect-[4/3] lg:aspect-auto" : "aspect-video"}`}>
                    <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-6 flex flex-col">
                    <div className="mb-2">
                      <span className="text-xs font-medium bg-primary-300 text-primary px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-text-200 mb-4 flex-grow">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-text-200 mb-4">
                      <User className="h-4 w-4 mr-1" />
                      <span className="mr-4">{post.author}</span>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">{post.date}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                    <Button asChild>
                      <Link href={`/blog/${post.id}`}>Read More</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-bg-200">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-2">
                        <span className="text-xs font-medium bg-primary-300 text-primary px-2 py-1 rounded">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                      <p className="text-text-200 text-sm mb-4">{post.excerpt}</p>
                      <div className="flex items-center text-xs text-text-200">
                        <User className="h-3 w-3 mr-1" />
                        <span className="mr-3">{post.author}</span>
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="mr-3">{post.date}</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/blog/${post.id}`}>Read More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            </div>

            <div>
              <div className="bg-card rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold mb-4">Search</h3>
                <BlogSearch />
              </div>

              <div className="bg-card rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold mb-4">Categories</h3>
                <ul className="space-y-2">
                  {["Live Streaming", "Media Production", "Digital Marketing", "Event Management", "Esports"].map(
                    (category) => (
                      <li key={category}>
                        <Link
                          href={`/blog/category/${category.toLowerCase().replace(" ", "-")}`}
                          className="text-text-200 hover:text-primary transition-colors"
                        >
                          {category}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div className="bg-card rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Marketing",
                    "Video",
                    "Social Media",
                    "Events",
                    "Streaming",
                    "Production",
                    "Gaming",
                    "Technology",
                    "Strategy",
                    "Content",
                  ].map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag.toLowerCase().replace(" ", "-")}`}
                      className="text-xs bg-bg-200 hover:bg-primary hover:text-primary-foreground px-3 py-1 rounded-full transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Subscribe</h3>
                <p className="text-text-200 text-sm mb-4">
                  Stay updated with our latest articles and insights. Subscribe to our newsletter.
                </p>
                <BlogSearch isNewsletter />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

