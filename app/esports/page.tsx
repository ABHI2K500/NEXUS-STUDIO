"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Trophy, Users, Calendar, DollarSign, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import VideoPlayer from "@/components/video-player"
import { useVideoUpdate } from "@/components/video-update-provider"
import DebugVideo from "@/components/debug-video"

// Update the getFeaturedVideo function to use absolute URL and no caching
async function getFeaturedVideo() {
  try {
    // Use absolute URL with origin to ensure it works in all environments
    const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || '';
    const response = await fetch(`${origin}/api/video`, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      console.error("Error fetching featured video:", response.statusText);
      return {
        url: "https://www.youtube.com/watch?v=bJ5ClftUcBI",
        title: "Live Tournament Stream",
        isLive: true
      };
    }
    
    const data = await response.json();
    console.log("Fetched video data for esports page:", data);
    return data;
  } catch (error) {
    console.error("Error fetching featured video:", error);
    return {
      url: "https://www.youtube.com/watch?v=bJ5ClftUcBI",
      title: "Live Tournament Stream",
      isLive: true
    };
  }
}

export default function EsportsPage() {
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false)
  const [featuredVideo, setFeaturedVideo] = useState({
    url: "https://www.youtube.com/watch?v=bJ5ClftUcBI",
    title: "Live Tournament Stream",
    isLive: true
  })
  const { showVideoUpdateNotification } = useVideoUpdate()
  const [lastVideoUrl, setLastVideoUrl] = useState("")

  useEffect(() => {
    // Fetch featured video with a refresh interval
    const loadFeaturedVideo = async () => {
      try {
        const videoData = await getFeaturedVideo();
        console.log("Setting featured video for esports page:", videoData);
        
        // Check if the video URL has changed
        if (lastVideoUrl && lastVideoUrl !== videoData.url) {
          // Show notification only if this isn't the first load
          showVideoUpdateNotification(videoData.url, videoData.title, videoData.isLive);
        }
        
        // Update state
        setFeaturedVideo(videoData);
        setLastVideoUrl(videoData.url);
      } catch (err) {
        console.error("Error loading featured video:", err);
      }
    };
    
    // Load immediately
    loadFeaturedVideo();
    
    // Then refresh every minute to catch updates
    const refreshInterval = setInterval(loadFeaturedVideo, 60 * 1000);
    
    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, [lastVideoUrl, showVideoUpdateNotification]);

  const tournaments = [
    {
      id: "lol-championship",
      title: "League of Legends Championship",
      game: "League of Legends",
      startDate: "June 15, 2023",
      registrationFee: "$25",
      prizePool: "$10,000",
      participants: "128",
      image: "/lol-logo.jpg?height=720&width=1280&text=League%20of%20Legends",
      status: "registration",
    },
    {
      id: "valorant-cup",
      title: "Valorant Summer Cup",
      game: "Valorant",
      startDate: "July 10, 2023",
      registrationFee: "$20",
      prizePool: "$8,000",
      participants: "64",
      image: "/valorant-logo.jpg?height=720&width=1280&text=Valorant",
      status: "registration",
    },
    {
      id: "fortnite-battle",
      title: "Fortnite Battle Royale",
      game: "Fortnite",
      startDate: "July 22, 2023",
      registrationFee: "$15",
      prizePool: "$5,000",
      participants: "100",
      image: "/fortnit-logo.jpg?height=720&width=1280&text=Fortnite",
      status: "registration",
    },
    {
      id: "csgo-masters",
      title: "CS:GO Masters",
      game: "Counter-Strike: Global Offensive",
      startDate: "August 5, 2023",
      registrationFee: "$30",
      prizePool: "$12,000",
      participants: "64",
      image: "/cs-go-logo.jpg?height=720&width=1280&text=CSGO",
      status: "registration",
    },
    {
      id: "rocket-league",
      title: "Rocket League Tournament",
      game: "Rocket League",
      startDate: "August 19, 2023",
      registrationFee: "$15",
      prizePool: "$6,000",
      participants: "32",
      image: "/rocket-league-logo.jpg?height=720&width=1280&text=Rocket%20League",
      status: "registration",
    },
  ]

  const leaderboard = [
    { rank: 1, player: "NinjaWarrior", points: 2850, wins: 42, tournaments: 15 },
    { rank: 2, player: "ProGamer123", points: 2720, wins: 38, tournaments: 14 },
    { rank: 3, player: "eSportsKing", points: 2650, wins: 36, tournaments: 16 },
    { rank: 4, player: "VictoryQueen", points: 2580, wins: 34, tournaments: 13 },
    { rank: 5, player: "GamingLegend", points: 2510, wins: 32, tournaments: 15 },
    { rank: 6, player: "PixelSniper", points: 2430, wins: 30, tournaments: 14 },
    { rank: 7, player: "TacticalMaster", points: 2350, wins: 28, tournaments: 12 },
    { rank: 8, player: "DigitalAssassin", points: 2290, wins: 26, tournaments: 13 },
    { rank: 9, player: "StreamerPro", points: 2210, wins: 24, tournaments: 11 },
    { rank: 10, player: "VirtualHero", points: 2150, wins: 22, tournaments: 12 },
  ]

  const matches = [
    {
      id: 1,
      player1: "NinjaWarrior",
      player2: "ProGamer123",
      game: "League of Legends",
      date: "June 18, 2023",
      time: "2:00 PM",
    },
    {
      id: 2,
      player1: "eSportsKing",
      player2: "VictoryQueen",
      game: "Valorant",
      date: "June 18, 2023",
      time: "4:00 PM",
    },
    {
      id: 3,
      player1: "GamingLegend",
      player2: "PixelSniper",
      game: "Fortnite",
      date: "June 19, 2023",
      time: "1:00 PM",
    },
    {
      id: 4,
      player1: "TacticalMaster",
      player2: "DigitalAssassin",
      game: "CS:GO",
      date: "June 19, 2023",
      time: "3:00 PM",
    },
    {
      id: 5,
      player1: "StreamerPro",
      player2: "VirtualHero",
      game: "Rocket League",
      date: "June 20, 2023",
      time: "2:00 PM",
    },
  ]

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 z-0">
          <Image
            src="/esports-logo.jpeg?height=1080&width=1920&text=Esports"
            alt="Esports"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Esports Services</h1>
            <p className="text-xl text-text-200 max-w-2xl">
              Join our thriving esports community, participate in tournaments, and take your gaming to the next level.
            </p>
            <Button asChild size="lg">
              <a href="#tournaments">Browse Tournaments</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Live Stream Section - Add this section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium border-primary/30 bg-primary/5">
              Live Now
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text px-6 py-4">Featured Tournament Stream</h2>
            <p className="text-muted-foreground">
              Watch the latest tournament action live and follow your favorite players.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VideoPlayer
              src={featuredVideo.url}
              poster="/game.jpg"
              title={featuredVideo.title}
              isLive={featuredVideo.isLive}
            />
          </div>
        </div>
      </section>

      {/* Tournaments Section */}
      <section id="tournaments" className="py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Upcoming Tournaments</h2>
            <p className="text-text-200">
              Register for our upcoming esports tournaments and compete for glory and prizes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.map((tournament) => (
              <Card key={tournament.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={tournament.image || "/placeholder.svg"}
                    alt={tournament.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{tournament.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                      <div>
                        <p className="text-xs text-text-200">Start Date</p>
                        <p className="text-sm font-medium">{tournament.startDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                      <div>
                        <p className="text-xs text-text-200">Registration Fee</p>
                        <p className="text-sm font-medium">{tournament.registrationFee}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Trophy className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                      <div>
                        <p className="text-xs text-text-200">Prize Pool</p>
                        <p className="text-sm font-medium">{tournament.prizePool}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                      <div>
                        <p className="text-xs text-text-200">Participants</p>
                        <p className="text-sm font-medium">{tournament.participants}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Register Now</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Register for {tournament.title}</DialogTitle>
                        <DialogDescription>
                          Fill out the form below to register for the tournament. Registration fee:{" "}
                          {tournament.registrationFee}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="first-name">First name</Label>
                            <Input id="first-name" />
                          </div>
                          <div>
                            <Label htmlFor="last-name">Last name</Label>
                            <Input id="last-name" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" />
                        </div>
                        <div>
                          <Label htmlFor="gamertag">Gamer Tag</Label>
                          <Input id="gamertag" />
                        </div>
                        <div>
                          <Label htmlFor="platform">Platform</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pc">PC</SelectItem>
                              <SelectItem value="playstation">PlayStation</SelectItem>
                              <SelectItem value="xbox">Xbox</SelectItem>
                              <SelectItem value="nintendo">Nintendo Switch</SelectItem>
                              <SelectItem value="mobile">Mobile</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="payment">Payment Method</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="credit-card">Credit Card</SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                              <SelectItem value="crypto">Cryptocurrency</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setShowRegistrationSuccess(true)}>Complete Registration</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showRegistrationSuccess} onOpenChange={setShowRegistrationSuccess}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Registration Successful!</DialogTitle>
                        <DialogDescription>
                          You have successfully registered for {tournament.title}. We've sent a confirmation email with
                          all the details.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="mb-4">Tournament Details:</p>
                        <ul className="space-y-2 text-sm">
                          <li>
                            <strong>Game:</strong> {tournament.game}
                          </li>
                          <li>
                            <strong>Start Date:</strong> {tournament.startDate}
                          </li>
                          <li>
                            <strong>Registration Fee:</strong> {tournament.registrationFee}
                          </li>
                          <li>
                            <strong>Prize Pool:</strong> {tournament.prizePool}
                          </li>
                        </ul>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setShowRegistrationSuccess(false)}>Close</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Matches & Leaderboard Section */}
      <section className="py-16 bg-bg-200">
        <div className="container">
          <Tabs defaultValue="matches" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="matches">Upcoming Matches</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="matches" className="mt-0">
              <div className="bg-card rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-2xl font-bold">Upcoming Matches</h3>
                  <p className="text-text-200">Contact your opponent to coordinate match details.</p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Match</TableHead>
                        <TableHead>Game</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matches.map((match) => (
                        <TableRow key={match.id}>
                          <TableCell className="font-medium">
                            {match.player1} vs {match.player2}
                          </TableCell>
                          <TableCell>{match.game}</TableCell>
                          <TableCell>{match.date}</TableCell>
                          <TableCell>{match.time}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Contact
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Contact Your Opponent</DialogTitle>
                                  <DialogDescription>
                                    Send a message to coordinate match details with your opponent.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div>
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                      id="message"
                                      placeholder="Hi, I'm looking forward to our match. Let's discuss the details..."
                                      rows={5}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button>Send Message</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-0">
              <div className="bg-card rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-2xl font-bold">Player Leaderboard</h3>
                  <p className="text-text-200">Top players ranked by performance across all tournaments.</p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Wins</TableHead>
                        <TableHead>Tournaments</TableHead>
                        <TableHead>Profile</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard.map((player) => (
                        <TableRow key={player.player}>
                          <TableCell className="font-medium">#{player.rank}</TableCell>
                          <TableCell>{player.player}</TableCell>
                          <TableCell>{player.points}</TableCell>
                          <TableCell>{player.wins}</TableCell>
                          <TableCell>{player.tournaments}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/esports/players/${player.player.toLowerCase()}`}>View Profile</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Live Streaming Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Live Streaming</h2>
              <p className="text-text-200 mb-6">
                All our tournaments are professionally streamed with expert commentary. Watch live matches, highlights,
                and analysis from our esports events.
              </p>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary-300 flex items-center justify-center mr-3 mt-0.5">
                    <ArrowRight className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Professional Commentary</h3>
                    <p className="text-sm text-text-200">
                      Expert analysis and play-by-play commentary from industry professionals.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary-300 flex items-center justify-center mr-3 mt-0.5">
                    <ArrowRight className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Multi-Platform Streaming</h3>
                    <p className="text-sm text-text-200">Watch on Twitch, YouTube, Facebook Gaming, and our website.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary-300 flex items-center justify-center mr-3 mt-0.5">
                    <ArrowRight className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Interactive Viewing Experience</h3>
                    <p className="text-sm text-text-200">
                      Chat with other viewers, participate in polls, and win prizes during streams.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary-300 flex items-center justify-center mr-3 mt-0.5">
                    <ArrowRight className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">VOD Library</h3>
                    <p className="text-sm text-text-200">
                      Access past matches, highlights, and special content in our video library.
                    </p>
                  </div>
                </li>
              </ul>
              <Button asChild>
                <Link href="/esports/streams">Watch Streams</Link>
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=720&width=1280&text=Live%20Stream"
                  alt="Live Stream"
                  width={640}
                  height={360}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" variant="outline" className="bg-background/20 backdrop-blur-sm">
                    Watch Now
                  </Button>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-lg shadow-lg border">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="font-semibold">LIVE</span>
                </div>
                <p className="text-sm mt-1">League of Legends - Semifinals</p>
                <p className="text-xs text-text-200">12.5K viewers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Join the Competition?</h2>
            <p className="mb-8">
              Register for our upcoming tournaments, connect with other players, and showcase your skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <a href="#tournaments">Browse Tournaments</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Debug Video Component */}
      <DebugVideo />
    </div>
  )
}

