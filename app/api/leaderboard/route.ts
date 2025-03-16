import { NextResponse } from 'next/server';

// In-memory storage for leaderboard data
let leaderboardData = [
  {
    id: "1",
    name: "ProGamer123",
    rank: 1,
    score: 2500,
    avatar: "/avatars/player1.png",
    team: "Team Alpha",
    stats: { wins: 150, losses: 30, winRate: 83.3, avgScore: 2345 },
  },
  {
    id: "2",
    name: "NinjaWarrior",
    rank: 2,
    score: 2350,
    avatar: "/avatars/player2.png",
    team: "Team Beta",
    stats: { wins: 130, losses: 40, winRate: 76.5, avgScore: 2100 },
  },
  {
    id: "3",
    name: "PixelQueen",
    rank: 3,
    score: 2200,
    avatar: "/avatars/player3.png",
    team: "Team Gamma",
    stats: { wins: 120, losses: 35, winRate: 77.4, avgScore: 1950 },
  },
  {
    id: "4",
    name: "ShadowBlade",
    rank: 4,
    score: 2100,
    avatar: "/avatars/player4.png",
    team: "Team Alpha",
    stats: { wins: 110, losses: 45, winRate: 71.0, avgScore: 1850 },
  },
  {
    id: "5",
    name: "CyberSniper",
    rank: 5,
    score: 1950,
    avatar: "/avatars/player5.png",
    team: "Team Delta",
    stats: { wins: 95, losses: 50, winRate: 65.5, avgScore: 1750 },
  }
];

export async function GET() {
  try {
    return NextResponse.json(leaderboardData, { status: 200 });
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate the data
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid data format. Expected an array.' }, { status: 400 });
    }
    
    // Update the leaderboard data
    leaderboardData = data;
    
    // Sort by score
    leaderboardData.sort((a, b) => b.score - a.score);
    
    // Update ranks
    leaderboardData = leaderboardData.map((player, index) => ({
      ...player,
      rank: index + 1
    }));
    
    return NextResponse.json({ 
      message: 'Leaderboard updated successfully',
      data: leaderboardData 
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating leaderboard data:', error);
    return NextResponse.json({ error: 'Failed to update leaderboard data' }, { status: 500 });
  }
} 