import { requireAdmin } from "@/lib/auth"
import { AssignJudgesForm } from "@/components/assign-judges-form"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getEventById, fetchAPI } from "@/lib/api" // Importamos la conexión real

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// Helper para traer usuarios reales
async function getAllUsers() {
  return fetchAPI("/users")
}

// Helper para traer los jueces que YA estaban asignados
async function getAssignedJudgesIds(eventId: string) {
  try {
    const judges = await fetchAPI(`/events/${eventId}/judges`)
    return Array.isArray(judges) ? judges.map((j: any) => j.id.toString()) : []
  } catch (e) {
    return []
  }
}

export default async function AssignJudgesPage({ params }: PageProps) {
  // 1. Verificación de seguridad
  await requireAdmin()

  // 2. Resolver parámetros (Next.js 15/16)
  const { id } = await params 

  // 3. Cargar datos REALES en paralelo
  const [event, allUsers, assignedIds] = await Promise.all([
    getEventById(id).catch(() => null),
    getAllUsers().catch(() => []),
    getAssignedJudgesIds(id)
  ])

  // Si el evento no existe en la BD real, lanzamos 404
  if (!event) {
    notFound()
  }

  // 4. Filtrar usuarios reales que sean Jueces (role_id 2 o nombre de rol)
  const judges = Array.isArray(allUsers) 
    ? allUsers.filter((u: any) => u.role_id === 2 || u.role === 'Juez' || u.role === 'judge')
    : []

  // 5. Preparar objeto evento con los jueces asignados marcados
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

      <AssignJudgesForm event={eventWithJudges} judges={judges} />
    </div>
  )
}