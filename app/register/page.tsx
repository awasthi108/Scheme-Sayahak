"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Register() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    state: "",
    district: "",
    profession: "",
    income: "",
    language: "english",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      // In a real app, you would send this data to your backend
      console.log("Form submitted:", formData)
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {step === 1 ? "Create an Account" : "Complete Your Profile"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1
              ? "Enter your details to create an account"
              : "Tell us more about yourself for personalized recommendations"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(value) => handleSelectChange("state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                      <SelectItem value="west-bengal">West Bengal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input id="district" name="district" value={formData.district} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Select
                    value={formData.profession}
                    onValueChange={(value) => handleSelectChange("profession", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your profession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="farmer">Farmer</SelectItem>
                      <SelectItem value="business-owner">Business Owner</SelectItem>
                      <SelectItem value="government-employee">Government Employee</SelectItem>
                      <SelectItem value="private-sector">Private Sector Employee</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income">Annual Income (in ₹)</Label>
                  <Select value={formData.income} onValueChange={(value) => handleSelectChange("income", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below-250000">Below ₹2,50,000</SelectItem>
                      <SelectItem value="250000-500000">₹2,50,000 - ₹5,00,000</SelectItem>
                      <SelectItem value="500000-750000">₹5,00,000 - ₹7,50,000</SelectItem>
                      <SelectItem value="750000-1000000">₹7,50,000 - ₹10,00,000</SelectItem>
                      <SelectItem value="above-1000000">Above ₹10,00,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select value={formData.language} onValueChange={(value) => handleSelectChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred language" />
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
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full">
              {step === 1 ? "Continue" : "Complete Registration"}
            </Button>
            {step === 1 && (
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            )}
            {step === 2 && (
              <Button type="button" variant="outline" className="w-full" onClick={() => setStep(1)}>
                Back
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

