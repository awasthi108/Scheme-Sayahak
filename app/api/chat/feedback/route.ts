import { updateMessageFeedback } from "@/lib/models/chat"
import { getSession } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { messageId, feedback } = await req.json()

    if (!messageId || !feedback) {
      return new Response(JSON.stringify({ error: "Message ID and feedback are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (feedback !== "helpful" && feedback !== "not-helpful") {
      return new Response(JSON.stringify({ error: "Invalid feedback value" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const success = await updateMessageFeedback(messageId, feedback)

    if (!success) {
      return new Response(JSON.stringify({ error: "Failed to update message feedback" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Feedback API error:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

