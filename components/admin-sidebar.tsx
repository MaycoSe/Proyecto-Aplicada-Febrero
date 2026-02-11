"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LogoutButton } from "./logout-button"
import { LayoutDashboard, Users, Trophy, Calendar, FileText, Settings } from "lucide-react"

const navigation = [
  { name: "Panel Principal", href: "/admin", icon: LayoutDashboard },
  { name: "Usuarios y Jueces", href: "/admin/users", icon: Users },
  { name: "Clubes", href: "/admin/clubs", icon: Trophy },
  { name: "Eventos", href: "/admin/events", icon: Calendar },
  { name: "Reportes y Ranking", href: "/admin/reports", icon: FileText },
  { name: "Auditoría del Sistema", href: "/admin/audit", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex w-64 flex-col border-r border-slate-200 bg-white h-screen">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <h1 className="text-xl font-bold text-blue-900 tracking-tight">Camporee 2026</h1>
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
                isActive 
                  ? "bg-blue-50 text-blue-700 shadow-sm" // Activo: Azul claro
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900", // Inactivo: Slate
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-slate-400")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 p-4 bg-slate-50/50">
        <LogoutButton />
      </div>
    </div>
  )
}