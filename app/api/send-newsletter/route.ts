import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user has admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (profile?.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get request body
    const { emails, subject, content } = await request.json()

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return new NextResponse(JSON.stringify({ message: "No recipients specified" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return new NextResponse(JSON.stringify({ message: "Subject is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return new NextResponse(JSON.stringify({ message: "Content is required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Send newsletter to all subscribers
    const mailOptions = {
      from: process.env.SMTP_FROM,
      bcc: emails,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">${subject}</h1>
          <div style="line-height: 1.6; color: #444;">
            ${content}
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} NEXUS Studios. All rights reserved.<br>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe" style="color: #999;">Unsubscribe</a>
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    // Log the newsletter send in the database
    await supabase.from("newsletter_logs").insert({
      subject,
      content,
      recipient_count: emails.length,
      sent_by: session.user.id,
      sent_at: new Date().toISOString()
    })

    return new NextResponse(JSON.stringify({ message: "Newsletter sent successfully" }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error("Error sending newsletter:", error)
    return new NextResponse(
      JSON.stringify({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 