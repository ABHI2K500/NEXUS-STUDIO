const GROQ_API_KEY = "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"
const GROQ_API_URL = "https://api.groq.com/v1/chat/completions"

export async function getChatResponse(messages: { role: string; content: string }[]) {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData?.error?.message || 
        `API call failed: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from API")
    }

    return data.choices[0].message.content
  } catch (error) {
    console.error("Error calling Groq API:", error)
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      throw new Error("Network error. Please check your internet connection.")
    }
    throw error
  }
} 