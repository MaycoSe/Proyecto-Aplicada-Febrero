import { requireAdmin } from "@/lib/auth"
import { ClubForm } from "@/components/club-form"
import { mockClubs } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditClubPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params
  const club = mockClubs.find((c) => c.id === id)

  if (!club) notFound()

  return (
    <div className="container max-w-3xl py-6 space-y-6 animate-in slide-in-from-right-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/clubs">
            <Button variant="ghost" size="sm"><ArrowLeft className="mr-1 h-4 w-4" /> Volver</Button>
        </Link>
      </div>
      <ClubForm club={club} />
    </div>
  )
}