export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getEvents } from "@/lib/api"
import { EventsListClient } from "@/components/events-list-client"
import { Suspense } from "react" // <--- Importamos Suspense

// 1. Subcomponente que maneja la carga de datos de eventos
async function EventsData() {
  try {
    const events = await getEvents()
    return <EventsListClient events={events} />
  } catch (error) {
    console.error("Error cargando eventos:", error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
        Error al cargar los eventos. Por favor, intenta de nuevo.
      </div>
    )
  }
}

export default function EventsPage() {
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

      {/* 2. Envolvemos la carga en Suspense */}
      <Suspense fallback={
        <div className="flex flex-col space-y-3">
          <p className="text-slate-500 animate-pulse">Cargando eventos...</p>
          <div className="h-[300px] w-full bg-slate-100 rounded-xl animate-pulse" />
        </div>
      }>
        <EventsData />
      </Suspense>
    </div>
  )
}