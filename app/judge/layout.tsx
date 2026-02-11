export const dynamic = 'force-dynamic'; // <--- AGREGÁ ESTO

import type React from "react"
import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { JudgeHeader } from "@/components/judge-header"

export default async function JudgeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const user = await requireAuth()
    if (user.role !== "judge") {
      redirect("/admin")
    }
  } catch {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <JudgeHeader />
      <main className="container mx-auto max-w-4xl p-4">{children}</main>
    </div>
  )
}
