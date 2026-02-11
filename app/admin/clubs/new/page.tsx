import { requireAdmin } from "@/lib/auth"
import { ClubForm } from "@/components/club-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewClubPage() {
  await requireAdmin()

  return (
    <div className="container max-w-3xl py-6 space-y-6 animate-in slide-in-from-right-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/clubs">
            <Button variant="ghost" size="sm"><ArrowLeft className="mr-1 h-4 w-4" /> Volver</Button>
        </Link>
      </div>
      <ClubForm />
    </div>
  )
}