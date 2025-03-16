import { NextResponse } from "next/server";

// Context about Nexus Studio to help the AI respond appropriately
const SYSTEM_CONTEXT = `You are the AI assistant for Nexus Studio, a premier digital media services company.

About Nexus Studio:
- Specializes in live streaming, media production, digital marketing, event management, and esports services
- Offers professional multi-camera live streaming for virtual events, conferences, and broadcasts
- Provides high-quality video and photo production for commercials and promotional content
- Delivers strategic digital marketing including social media management, SEO, and targeted advertising
- Offers end-to-end event planning and execution for corporate events and conferences
- Provides esports services including tournament organization, player management, and competitive gaming events

Website Features:
- Portfolio section showcasing past client work
- Blog with industry insights and company updates
- Esports leaderboard displaying competitive rankings
- Contact form for potential clients to reach out
- About page with company history and team information

Your role is to be helpful, professional, and knowledgeable about Nexus Studio's services. Guide users to the appropriate sections of the website based on their interests, answer questions about services, and help potential clients understand how Nexus Studio can meet their needs.`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Add system message if not already present
        const formattedMessages = messages.some((msg: any) => msg.role === 'system') 
            ? messages 
            : [{ role: 'system', content: SYSTEM_CONTEXT }, ...messages];

        // Use fetch to call Groq API directly
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: formattedMessages,
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Groq API error:", errorData);
            throw new Error(`API call failed with status ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json({ response: data.choices[0]?.message?.content || "No response" });
    } catch (error) {
        console.error("Error in chat route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 