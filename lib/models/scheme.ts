import type { ObjectId } from "mongodb"
import clientPromise from "../mongodb"

export interface GovernmentScheme {
  _id?: ObjectId
  title: string
  description: string
  eligibility: string
  benefit: string
  category: string
  state?: string // For state-specific schemes
  minAge?: number
  maxAge?: number
  professions?: string[]
  incomeRange?: {
    min?: number
    max?: number
  }
  applicationUrl?: string
  documentationRequired?: string[]
  createdAt: Date
  updatedAt: Date
}

export async function getAllSchemes() {
  const client = await clientPromise
  const db = client.db("schemesahayak")

  return db.collection("schemes").find({}).toArray()
}

export async function getSchemesByCategory(category: string) {
  const client = await clientPromise
  const db = client.db("schemesahayak")

  return db.collection("schemes").find({ category }).toArray()
}

export async function getSchemesByState(state: string) {
  const client = await clientPromise
  const db = client.db("schemesahayak")

  return db
    .collection("schemes")
    .find({
      $or: [
        { state },
        { state: { $exists: false } }, // Include central schemes
      ],
    })
    .toArray()
}

export async function getRecommendedSchemes(userProfile: {
  age: number
  state: string
  profession: string
  income: string
}) {
  const client = await clientPromise
  const db = client.db("schemesahayak")

  // Parse income range from string like "250000-500000"
  const incomeRanges = {
    "below-250000": { max: 250000 },
    "250000-500000": { min: 250000, max: 500000 },
    "500000-750000": { min: 500000, max: 750000 },
    "750000-1000000": { min: 750000, max: 1000000 },
    "above-1000000": { min: 1000000 },
  }

  const incomeRange = incomeRanges[userProfile.income as keyof typeof incomeRanges] || {}

  // Build query based on user profile
  const query: any = {
    $and: [
      // Age criteria
      {
        $or: [{ minAge: { $exists: false } }, { minAge: { $lte: userProfile.age } }],
      },
      {
        $or: [{ maxAge: { $exists: false } }, { maxAge: { $gte: userProfile.age } }],
      },
      // State criteria
      {
        $or: [
          { state: userProfile.state },
          { state: { $exists: false } }, // Include central schemes
        ],
      },
    ],
  }

  // Add profession criteria if applicable
  if (userProfile.profession) {
    query.$and.push({
      $or: [
        { professions: userProfile.profession },
        { professions: { $exists: false } }, // Include schemes without profession restrictions
      ],
    })
  }

  // Add income criteria if applicable
  if (incomeRange.min !== undefined) {
    query.$and.push({
      $or: [{ "incomeRange.max": { $exists: false } }, { "incomeRange.max": { $gte: incomeRange.min } }],
    })
  }

  if (incomeRange.max !== undefined) {
    query.$and.push({
      $or: [{ "incomeRange.min": { $exists: false } }, { "incomeRange.min": { $lte: incomeRange.max } }],
    })
  }

  return db.collection("schemes").find(query).toArray()
}

