import { ObjectId } from "mongodb"
import clientPromise from "../mongodb"

export interface ChatMessage {
  _id?: ObjectId
  userId: string
  role: "user" | "assistant"
  content: string
  feedback?: "helpful" | "not-helpful"
  reported?: boolean
  createdAt: Date
}

export async function saveMessage(message: Omit<ChatMessage, "_id" | "createdAt">) {
  const client = await clientPromise
  const db = client.db("schemesahayak")

  const newMessage = {
    ...message,
    createdAt: new Date(),
  }

  const result = await db.collection("messages").insertOne(newMessage)
  return { ...newMessage, _id: result.insertedId }
}

export async function getUserMessages(userId: string) {
  const client = await clientPromise
  const db = client.db("schemesahayak")

  return db.collection("messages").find({ userId }).sort({ createdAt: 1 }).toArray()
}

export async function updateMessageFeedback(messageId: string, feedback: "helpful" | "not-helpful") {
  const client = await clientPromise
  const db = client.db("schemesahayak")

  const result = await db.collection("messages").updateOne({ _id: new ObjectId(messageId) }, { $set: { feedback } })

  return result.modifiedCount > 0
}

export async function reportMessage(messageId: string) {
  const client = await clientPromise
  const db = client.db("schemesahayak")

  const result = await db
    .collection("messages")
    .updateOne({ _id: new ObjectId(messageId) }, { $set: { reported: true } })

  return result.modifiedCount > 0
}

