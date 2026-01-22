"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LogoutButton } from "./logout-button"
import { ClipboardList, User } from "lucide-react"

export function JudgeHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo / Título */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 rounded-lg p-1.5">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-blue-950 tracking-tight">
            Panel de Jueces
          </span>
        </div>

        {/* Navegación Derecha */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/judge"
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-600",
                pathname === "/judge" ? "text-blue-600" : "text-slate-600"
              )}
            >
              Mis Eventos
            </Link>
          </nav>
          
          <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
             <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-700">Juez Activo</p>
                <p className="text-[10px] text-slate-500">Sesión iniciada</p>
             </div>
             <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}