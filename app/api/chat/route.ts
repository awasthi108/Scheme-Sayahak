import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { saveMessage } from "@/lib/models/chat"
import { getSession } from "@/lib/auth" // You'll need to implement this

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Get the current user session
    const session = await getSession()
    const userId = session?.user?.id

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { messages } = await req.json()

    // Save the user message to the database
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()
    if (lastUserMessage) {
      await saveMessage({
        userId,
        role: "user",
        content: lastUserMessage.content,
      })
    }

    // Create a system prompt that guides the model to provide information about Indian government schemes
    const systemPrompt = `
      You are an AI assistant specialized in providing information about Indian government schemes.
      
      Your role is to:
      1. Provide accurate information about government schemes in India
      2. Help users understand eligibility criteria for different schemes
      3. Explain application processes and required documents
      4. Suggest relevant schemes based on user profiles (age, location, profession, income)
      5. Answer questions in a clear, concise manner
      
      Important guidelines:
      - Only provide information about legitimate government schemes
      - If you're unsure about any information, acknowledge your limitations
      - Do not make up information about schemes that don't exist
      - Focus on central and state government schemes in India
      - Provide information about how to verify scheme authenticity to avoid scams
      - When appropriate, suggest official government websites or helplines for more information
      
      Common schemes to be familiar with:
      - PM Kisan Samman Nidhi
      - Ayushman Bharat
      - PM Awas Yojana
      - Sukanya Samriddhi Yojana
      - PM Ujjwala Yojana
      - Atal Pension Yojana
      - PM Mudra Yojana
      - Various state-specific schemes
    `

    // Use the OpenAI API key from environment variables
    const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
    })

    // Save the assistant's response to the database
    result.text.then(async (content) => {
      await saveMessage({
        userId,
        role: "assistant",
        content,
      })
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

