export const dynamic = 'force-dynamic'; // <--- AGREGÁ ESTO

import type React from "react"
import { requireAdmin } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin-sidebar"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    await requireAdmin()
  } catch {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  )
}
