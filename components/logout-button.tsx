"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  className?: string
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive"
}

export function LogoutButton({ className, variant = "ghost" }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await logout()
    router.push("/login")
    router.refresh() // Forzar recarga para limpiar caché de usuario
  }

  return (
    <Button 
        variant={variant} 
        onClick={handleLogout} 
        className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 ${className}`}
        disabled={isLoading}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoading ? "Saliendo..." : "Cerrar Sesión"}
    </Button>
  )
}