"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send, User, Bot, ThumbsUp, ThumbsDown, Flag, Loader2 } from "lucide-react"
import { useChat } from "@ai-sdk/react"

export default function Chat() {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [language, setLanguage] = useState("english")
  const [feedback, setFeedback] = useState<Record<string, string>>({})

  // Use the AI SDK's useChat hook for chat functionality
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content:
          "Hello! I'm your Government Scheme Assistant. How can I help you today? You can ask me about various government schemes, eligibility criteria, or benefits available to you.",
      },
    ],
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle language change
  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    // In a real app, you would update the user's language preference in the backend
  }

  // Handle message feedback
  const handleFeedback = async (messageId: string, type: string) => {
    setFeedback((prev) => ({ ...prev, [messageId]: type }))

    try {
      const response = await fetch("/api/chat/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          feedback: type === "helpful" ? "helpful" : "not-helpful",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit feedback")
      }
    } catch (error) {
      console.error("Feedback error:", error)
      // Revert the UI state if the API call fails
      setFeedback((prev) => {
        const newState = { ...prev }
        delete newState[messageId]
        return newState
      })
    }
  }

  // Handle report message
  const handleReport = async (messageId: string) => {
    try {
      const response = await fetch("/api/chat/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId }),
      })

      if (!response.ok) {
        throw new Error("Failed to report message")
      }

      alert("Thank you for reporting this message. We will review it shortly.")
    } catch (error) {
      console.error("Report error:", error)
      alert("Failed to report message. Please try again later.")
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center h-16 px-4 border-b bg-white">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-medium">Government Scheme Assistant</h1>
        <div className="ml-auto">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">Hindi</SelectItem>
              <SelectItem value="tamil">Tamil</SelectItem>
              <SelectItem value="telugu">Telugu</SelectItem>
              <SelectItem value="kannada">Kannada</SelectItem>
              <SelectItem value="malayalam">Malayalam</SelectItem>
              <SelectItem value="marathi">Marathi</SelectItem>
              <SelectItem value="bengali">Bengali</SelectItem>
              <SelectItem value="gujarati">Gujarati</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`flex items-center justify-center h-8 w-8 rounded-full ${message.role === "user" ? "bg-primary ml-2" : "bg-gray-200 mr-2"}`}
                >
                  {message.role === "user" ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-gray-700" />
                  )}
                </div>
                <div className="space-y-2">
                  <div
                    className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary text-white" : "bg-white border"}`}
                  >
                    {message.content}
                  </div>
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <button
                        onClick={() => handleFeedback(message.id, "helpful")}
                        className={`flex items-center ${feedback[message.id] === "helpful" ? "text-green-500" : ""}`}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Helpful
                      </button>
                      <button
                        onClick={() => handleFeedback(message.id, "not-helpful")}
                        className={`flex items-center ${feedback[message.id] === "not-helpful" ? "text-red-500" : ""}`}
                      >
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Not Helpful
                      </button>
                      <button onClick={() => handleReport(message.id)} className="flex items-center">
                        <Flag className="h-3 w-3 mr-1" />
                        Report
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 mr-2">
                  <Bot className="h-5 w-5 text-gray-700" />
                </div>
                <div className="p-3 rounded-lg bg-white border">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
        <div className="max-w-3xl mx-auto mt-2 text-xs text-gray-500">
          <p>
            Ask about schemes like PM Kisan, Ayushman Bharat, or PM Awas Yojana. You can also ask about eligibility
            criteria or application processes.
          </p>
        </div>
      </div>
    </div>
  )
}

