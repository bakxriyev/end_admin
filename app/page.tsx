// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const savedAdminData = localStorage.getItem("adminData")

    if (token && savedAdminData) {
      setIsAuthenticated(true)
      router.push("/dashboard")
    }
    setIsLoading(false)
  }, [router])

  const handleLoginSuccess = (data: any) => {
    localStorage.setItem("authToken", data.token || "mock-token")
    localStorage.setItem("adminData", JSON.stringify(data))
    setIsAuthenticated(true)
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null 
  }

  return <LoginForm onLoginSuccess={handleLoginSuccess} />
}