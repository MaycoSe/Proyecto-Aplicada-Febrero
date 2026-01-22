"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push("/login")
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
}
