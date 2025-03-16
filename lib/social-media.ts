interface SocialPost {
  title: string
  content: string
  image?: string
  url?: string
  tags?: string[]
  platforms: ("twitter" | "facebook" | "linkedin" | "instagram")[]
}

export async function shareToSocialMedia(post: SocialPost) {
  const results = await Promise.allSettled(
    post.platforms.map(async (platform) => {
      try {
        // Replace these with actual API calls to respective platforms
        switch (platform) {
          case "twitter":
            return await postToTwitter(post)
          case "facebook":
            return await postToFacebook(post)
          case "linkedin":
            return await postToLinkedIn(post)
          case "instagram":
            return await postToInstagram(post)
        }
      } catch (error) {
        console.error(`Error posting to ${platform}:`, error)
        throw error
      }
    })
  )

  return results
}

async function postToTwitter(post: SocialPost) {
  // Implement Twitter API integration
  // Example using Twitter API v2
  const content = `${post.title}\n\n${post.content}`
  return { platform: "twitter", success: true, postId: "mock-tweet-id" }
}

async function postToFacebook(post: SocialPost) {
  // Implement Facebook API integration
  return { platform: "facebook", success: true, postId: "mock-fb-post-id" }
}

async function postToLinkedIn(post: SocialPost) {
  // Implement LinkedIn API integration
  return { platform: "linkedin", success: true, postId: "mock-linkedin-post-id" }
}

async function postToInstagram(post: SocialPost) {
  // Implement Instagram API integration
  return { platform: "instagram", success: true, postId: "mock-instagram-post-id" }
}

// Webhook handler for new blog posts
export async function handleNewBlogPost(blogPost: {
  title: string
  excerpt: string
  url: string
  image?: string
  tags?: string[]
}) {
  return await shareToSocialMedia({
    title: blogPost.title,
    content: blogPost.excerpt,
    url: blogPost.url,
    image: blogPost.image,
    tags: blogPost.tags,
    platforms: ["twitter", "facebook", "linkedin"],
  })
}

// Webhook handler for new esports events
export async function handleNewEsportsEvent(event: {
  title: string
  description: string
  startDate: string
  venue?: string
  image?: string
  registrationUrl?: string
}) {
  const content = `🎮 New Event: ${event.title}\n📅 ${event.startDate}${
    event.venue ? `\n📍 ${event.venue}` : ""
  }\n\n${event.description}`

  return await shareToSocialMedia({
    title: event.title,
    content,
    image: event.image,
    url: event.registrationUrl,
    tags: ["esports", "gaming", "tournament"],
    platforms: ["twitter", "facebook", "instagram"],
  })
} 