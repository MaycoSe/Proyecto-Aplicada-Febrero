"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LogoutButton } from "./logout-button"
import { LayoutDashboard, Users, Trophy, Calendar, FileText, Settings } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Clubs", href: "/admin/clubs", icon: Trophy },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Audit Logs", href: "/admin/audit", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <h1 className="text-xl font-bold text-slate-900">Camp Score</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <LogoutButton />
      </div>
    </div>
  )
}
