import { requireAdmin } from "@/lib/auth"
import { AssignJudgesForm } from "@/components/assign-judges-form"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
// IMPORTANTE: Importamos getJudges en vez de getAllUsers
import { getEventById, getJudges, fetchAPI } from "@/lib/api" 

interface PageProps {
  params: Promise<{ id: string }>
}

// Helper para traer los jueces YA asignados (IDs)
async function getAssignedJudgesIds(eventId: string) {
  try {
    const judges = await fetchAPI(`/events/${eventId}/judges`)
    return Array.isArray(judges) ? judges.map((j: any) => j.id.toString()) : []
  } catch (e) {
    return []
  }
}

export default async function AssignJudgesPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params 

  // Cargar datos en paralelo
  const [event, judgesList, assignedIds] = await Promise.all([
    getEventById(id).catch(() => null),
    getJudges().catch(() => []), // <--- Usamos getJudges() directo
    getAssignedJudgesIds(id)
  ])

  if (!event) {
    notFound()
  }

  // Preparamos el evento con sus asignaciones actuales
  const eventWithJudges = {
    ...event,
    assignedJudges: assignedIds
  }

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

      {/* Pasamos la lista limpia de jueces */}
      <AssignJudgesForm event={eventWithJudges} judges={judgesList} eventId={id} />
    </div>
  )
}