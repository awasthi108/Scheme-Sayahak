import { reportMessage } from "@/lib/models/chat"
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

    const { messageId } = await req.json()

    if (!messageId) {
      return new Response(JSON.stringify({ error: "Message ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const success = await reportMessage(messageId)

    if (!success) {
      return new Response(JSON.stringify({ error: "Failed to report message" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Report API error:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

