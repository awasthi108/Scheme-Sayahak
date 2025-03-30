import { ObjectId } from "mongodb"
import clientPromise from "../mongodb"

export interface UserProfile {
  _id?: ObjectId
  name: string
  email: string
  password: string // In a real app, this would be hashed
  age: number
  state: string
  district: string
  profession: string
  income: string
  language: string
  createdAt: Date
  updatedAt: Date
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise
  const db = client.db("schemesahayak")

  return db.collection("users").findOne({ email })
}

export async function createUser(userData: Omit<UserProfile, "_id" | "createdAt" | "updatedAt">) {
  const client = await clientPromise
  const db = client.db("schemesahayak")

  const now = new Date()
  const newUser = {
    ...userData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection("users").insertOne(newUser)
  return { ...newUser, _id: result.insertedId }
}

export async function updateUserProfile(userId: string, updateData: Partial<UserProfile>) {
  const client = await clientPromise
  const db = client.db("schemesahayak")

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        ...updateData,
        updatedAt: new Date(),
      },
    },
  )

  return result.modifiedCount > 0
}

