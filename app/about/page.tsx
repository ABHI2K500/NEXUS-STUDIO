import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "About Us - ABC Studios",
  description: "Learn about ABC Studios, our mission, vision, values, and the team behind our success.",
}

export default function AboutPage() {
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 z-0">
          <Image
            src="/nexus.jpg?height=1080&width=1920&text=About%20Us"
            alt="About Us"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">About Nexus Studios</h1>
            <p className="text-xl text-text-200 max-w-2xl">
              We're a team of passionate creators, technologists, and strategists dedicated to transforming ideas into
              digital reality.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-text-200">
                <p>
                  Founded in 2015, Nexus Studios began as a small team of digital enthusiasts with a shared vision: to
                  create meaningful digital experiences that connect brands with their audiences.
                </p>
                <p>
                  What started as a boutique media production company has evolved into a full-service digital agency,
                  offering comprehensive solutions across live streaming, media production, digital marketing, and event
                  management.
                </p>
                <p>
                  Over the years, we've had the privilege of working with clients ranging from startups to Fortune 500
                  companies, helping them navigate the ever-changing digital landscape and achieve their business
                  objectives.
                </p>
                <p>
                  Today, Nexus Studios stands as a leader in the industry, known for our innovative approach, technical
                  expertise, and unwavering commitment to client success.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/nexus.jpg?height=720&width=1280&text=Our%20Story"
                alt="Our Story"
                width={640}
                height={480}
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg w-48 text-center">
                <p className="font-semibold">Est. 2015</p>
                <p className="text-sm">8+ Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-bg-200">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Guiding Principles</h2>
            <p className="text-text-200">The core beliefs and values that drive everything we do at Nexus Studios.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-primary-300 text-primary p-2 rounded-md mr-3">Mission</span>
                </h3>
                <p className="text-text-200">
                  To empower businesses and creators with cutting-edge digital solutions that drive engagement, growth,
                  and meaningful connections with their audiences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-primary-300 text-primary p-2 rounded-md mr-3">Vision</span>
                </h3>
                <p className="text-text-200">
                  To be the leading digital partner for innovative brands, setting new standards in digital content
                  creation, distribution, and audience engagement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-primary-300 text-primary p-2 rounded-md mr-3">Values</span>
                </h3>
                <ul className="text-text-200 space-y-2">
                  <li>• Innovation: We embrace new technologies and approaches</li>
                  <li>• Excellence: We strive for the highest quality in everything we do</li>
                  <li>• Integrity: We operate with honesty and transparency</li>
                  <li>• Collaboration: We believe in the power of teamwork</li>
                  <li>• Client-Centric: We put our clients' needs at the center</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-text-200">The talented individuals who make the magic happen at ABC Studios.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Abhijith S",
                role: "Founder & CEO",
                bio: "With over 15 years of experience in digital media, Abhijith S leads our team with vision and expertise.",
                src: "/s.jpg",
              },
              {
                name: "Ananthakrishnan K V",
                role: "Creative Director",
                bio: "Ananthan brings creative concepts to life with her innovative approach to design and storytelling.",
                src: "/pfp.jpg",
              },
              {
                name: "Abhijith P",
                role: "Technical Director",
                bio: "Abhijith P oversees all technical aspects of our productions, ensuring flawless execution.",
                src: "/p.jpg",
              },
            ].map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={member.src || `/placeholder.svg?height=400&width=400&text=${member.name}`}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-text-200 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
              <p className="mb-6">
                We're always looking for talented individuals who are passionate about digital media and technology. If
                you're creative, driven, and eager to make an impact, we'd love to hear from you.
              </p>
              <Button variant="secondary" asChild>
                <Link href="/join-us">View Open Positions</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="/alex.jpg?height=300&width=300&text=Team%201"
                alt="Team"
                width={270}
                height={270}
                className="rounded-lg"
              />
              <Image
                src="/niranjan.jpg?height=300&width=300&text=Team%202"
                alt="Team"
                width={270}
                height={270}
                className="rounded-lg"
              />
              <Image
                src="/nandhu.jpg?height=300&width=300&text=Team%203"
                alt="Team"
                width={270}
                height={270}
                className="rounded-lg"
              />
              <Image
                src="/sarju-s.jpg?height=300&width=300&text=Team%204"
                alt="Team"
                width={300}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

