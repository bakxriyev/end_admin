"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface ProtectedLayoutProps {
  children: React.ReactNode
  adminData: any
  onLogout: () => void
}

export function ProtectedLayout({ children, adminData, onLogout }: ProtectedLayoutProps) {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const pathname = usePathname()
  const router = useRouter()

  // Pathname o'zgarganda currentPage ni yangilash
  useEffect(() => {
    const routes = {
      "/dashboard": "dashboard",
      "/clinic-requests": "clinic_requests",
      "/admin": "admin",
      "/doctors": "doctor",
      "/news": "news",
      "/blog": "blog",
      "/services": "services",
      "/insurance": "insurance",
      "/careers": "career",
      "/directions": "direction",
    }

    const page = routes[pathname as keyof typeof routes] || "dashboard"
    setCurrentPage(page)
  }, [pathname])

  // Agar auth yo'q bo'lsa, login sahifasiga yo'naltirish
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={(page) => {
          const routeMap: { [key: string]: string } = {
            dashboard: "/dashboard",
            clinic_requests: "/clinic-requests",
            admin: "/admin",
            doctor: "/doctors",
            news: "/news",
            blog: "/blog",
            services: "/services",
            insurance: "/insurance",
            career: "/careers",
            direction: "/directions",
          }
          router.push(routeMap[page] || "/dashboard")
        }} 
        adminData={adminData} 
        onLogout={onLogout} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header adminData={adminData} onLogout={onLogout} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}