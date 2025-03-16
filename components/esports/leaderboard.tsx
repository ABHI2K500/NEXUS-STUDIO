import { useState, useEffect } from "react"
import { Trophy, Medal, Star } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Player {
  id: string
  name: string
  rank: number
  score: number
  avatar: string
  team: string
  stats: {
    wins: number
    losses: number
    winRate: number
    avgScore: number
  }
}

export default function EsportsLeaderboard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch leaderboard data from API
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/leaderboard', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        // Fallback to empty array if fetch fails
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial fetch
    fetchLeaderboardData();
    
    // Set up polling for updates every 30 seconds
    const interval = setInterval(fetchLeaderboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <Star className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold gradient-text px-6 py-4">Live Leaderboard</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No leaderboard data available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/5 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedPlayer(player)
                      setShowProfile(true)
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center justify-center w-8">
                        {getRankIcon(index + 1)}
                      </span>
                      <Avatar>
                        <AvatarImage src={player.avatar} />
                        <AvatarFallback>{player.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {player.team}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{player.score}</p>
                      <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        {selectedPlayer && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Player Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedPlayer.avatar} />
                  <AvatarFallback>{selectedPlayer.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg">{selectedPlayer.name}</h3>
                  <p className="text-muted-foreground">{selectedPlayer.team}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="font-medium">
                    {selectedPlayer.stats.winRate}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="font-medium">
                    {selectedPlayer.stats.avgScore}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Wins</p>
                  <p className="font-medium">{selectedPlayer.stats.wins}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Losses</p>
                  <p className="font-medium">{selectedPlayer.stats.losses}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
} 