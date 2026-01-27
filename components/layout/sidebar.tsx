// components/layout/sidebar.tsx
"use client"

import {
  LayoutDashboard,
  Stethoscope,
  Newspaper,
  BookOpen,
  Briefcase,
  Shield,
  Compass,
  LogOut,
  Menu,
  ClipboardList,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  adminData: any
  onLogout: () => void
}

export function Sidebar({ adminData, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/dashboard" },
    { id: "clinic_requests", label: "Zayafka", icon: ClipboardList, route: "/clinic-requests" },
    { id: "admin", label: "Admin", icon: Shield, route: "/admin" },
    { id: "doctor", label: "Doctors", icon: Stethoscope, route: "/doctors" },
    { id: "news", label: "News", icon: Newspaper, route: "/news" },
    { id: "blog", label: "Blog", icon: BookOpen, route: "/blog" },
    { id: "services", label: "Services", icon: Briefcase, route: "/services" },
    { id: "insurance", label: "Insurance", icon: Shield, route: "/insurance" },
    { id: "career", label: "Careers", icon: Briefcase, route: "/careers" },
    { id: "direction", label: "Directions", icon: Compass, route: "/directions" },
  ]

  return (
    <div
      className={`bg-slate-800 text-white transition-all duration-300 ${collapsed ? "w-20" : "w-64"} flex flex-col shadow-2xl`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-emerald-400">ONA VA BOLA CLINIC</h2>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-slate-700 p-2 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
            {adminData?.full_name?.[0]?.toUpperCase() || "A"}
          </div>
          {!collapsed && (
            <div className="text-sm overflow-hidden">
              <p className="font-semibold truncate">{adminData?.full_name || "Admin"}</p>
              <p className="text-xs text-slate-400 truncate">{adminData?.email || "admin@clinic.com"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.route
            
            return (
              <Link
                key={item.id}
                href={item.route}
                className={`block w-full`}
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer - Logout */}
      <div className="p-3 border-t border-slate-700">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200"
          onClick={onLogout}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  )
}