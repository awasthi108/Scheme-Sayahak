"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, User, FileText, Bell, LogOut, ChevronRight } from "lucide-react"

// Mock user data
const userData = {
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  age: 28,
  state: "Karnataka",
  district: "Bangalore Urban",
  profession: "Private Sector Employee",
  income: "₹5,00,000 - ₹7,50,000",
  language: "English",
}

// Mock recommended schemes
const recommendedSchemes = [
  {
    id: 1,
    title: "PM Kisan Samman Nidhi",
    description: "Financial assistance to farmer families across the country.",
    eligibility: "All farmer families with cultivable land.",
    benefit: "₹6,000 per year in three equal installments.",
    category: "Agriculture",
  },
  {
    id: 2,
    title: "Pradhan Mantri Awas Yojana",
    description: "Housing for all by 2022 mission launched by Government of India.",
    eligibility: "Families with annual income less than ₹18 lakhs.",
    benefit: "Financial assistance up to ₹2.67 lakhs for house construction.",
    category: "Housing",
  },
  {
    id: 3,
    title: "Sukanya Samriddhi Yojana",
    description: "Small savings scheme for girl child education and marriage expenses.",
    eligibility: "Parents of girl child below 10 years of age.",
    benefit: "High interest rate and tax benefits under Section 80C.",
    category: "Education",
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-white border-r md:flex">
        <div className="flex h-16 items-center border-b px-4">
          <span className="text-xl font-bold">SchemeSahayak</span>
        </div>
        <div className="flex flex-1 flex-col py-4">
          <nav className="space-y-1 px-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Overview
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link href="/notifications">
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
            </Link>
          </nav>
          <div className="mt-auto px-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-16 items-center border-b bg-white px-4 md:hidden">
          <span className="text-xl font-bold">SchemeSahayak</span>
          <div className="ml-auto">{/* Mobile menu button would go here */}</div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Welcome, {userData.name}</h1>
            <p className="text-gray-500">Find government schemes tailored for you</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>
                Overview
              </TabsTrigger>
              <TabsTrigger value="recommended" onClick={() => setActiveTab("recommended")}>
                Recommended Schemes
              </TabsTrigger>
              <TabsTrigger value="profile" onClick={() => setActiveTab("profile")}>
                My Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Start a Conversation</CardTitle>
                    <CardDescription>Chat with our AI assistant to find schemes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/chat">
                      <Button className="w-full">
                        Go to Chat
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Recommended Schemes</CardTitle>
                    <CardDescription>Schemes that match your profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{recommendedSchemes.length}</div>
                    <p className="text-xs text-gray-500">Based on your profile information</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Complete Your Profile</CardTitle>
                    <CardDescription>Update your information for better recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/profile">
                      <Button variant="outline" className="w-full">
                        Edit Profile
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Schemes</CardTitle>
                  <CardDescription>Recently added government schemes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedSchemes.slice(0, 2).map((scheme) => (
                      <div key={scheme.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <h3 className="font-medium">{scheme.title}</h3>
                        <p className="text-sm text-gray-500">{scheme.description}</p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{scheme.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommended" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Schemes</CardTitle>
                  <CardDescription>Government schemes that match your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recommendedSchemes.map((scheme) => (
                      <div key={scheme.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <h3 className="text-lg font-medium">{scheme.title}</h3>
                        <p className="mt-1 text-gray-500">{scheme.description}</p>
                        <div className="mt-4 grid gap-2 text-sm">
                          <div>
                            <span className="font-medium">Eligibility:</span> {scheme.eligibility}
                          </div>
                          <div>
                            <span className="font-medium">Benefit:</span> {scheme.benefit}
                          </div>
                          <div>
                            <span className="font-medium">Category:</span> {scheme.category}
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                  <CardDescription>Your personal information used for scheme recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p>{userData.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p>{userData.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Age</h3>
                      <p>{userData.age}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">State</h3>
                      <p>{userData.state}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">District</h3>
                      <p>{userData.district}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Profession</h3>
                      <p>{userData.profession}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Annual Income</h3>
                      <p>{userData.income}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Preferred Language</h3>
                      <p>{userData.language}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button>Edit Profile</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

