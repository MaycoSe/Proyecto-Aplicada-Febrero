export const dynamic = 'force-dynamic'; // <--- AGREGÁ ESTO
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getEvents } from "@/lib/api"
import { EventsListClient } from "@/components/events-list-client" // <--- Importación corregida

export default async function EventsPage() {
  let events = []
  
  try {
    events = await getEvents()
  } catch (error) {
    console.error("Error cargando eventos:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Eventos</h1>
          <p className="text-slate-500">Administra las actividades y criterios de evaluación.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95">
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Evento
          </Link>
        </Button>
      </div>

      <EventsListClient events={events} />
    </div>
  )
}