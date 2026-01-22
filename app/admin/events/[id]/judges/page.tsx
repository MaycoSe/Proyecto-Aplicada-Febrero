import { requireAdmin } from "@/lib/auth"
import { mockEvents, mockUsers } from "@/lib/mock-data"
import { AssignJudgesForm } from "@/components/assign-judges-form"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AssignJudgesPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params // Resolvemos la promesa (Next.js 15/16)

  // 1. Buscar el evento
  const event = mockEvents.find((e) => e.id === id)
  if (!event) {
    notFound()
  }

  // 2. Filtrar solo los usuarios que son Jueces
  const judges = mockUsers.filter(u => u.role === 'judge' && u.isActive)

  return (
    <div className="container max-w-3xl py-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2">
        <Link href="/admin/events">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="mr-1 h-4 w-4" /> Volver a Eventos
            </Button>
        </Link>
      </div>

      <div className="px-1">
         <h1 className="text-3xl font-bold text-blue-950">Gestión de Personal</h1>
         <p className="text-slate-600">
            Define el equipo de evaluación para este evento específico.
         </p>
      </div>

      <AssignJudgesForm event={event} judges={judges} />
    </div>
  )
}