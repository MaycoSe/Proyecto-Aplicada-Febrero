export const dynamic = 'force-dynamic';

import { getJudgeEvents } from "@/lib/api"
import { JudgeEventsList } from "@/components/judge-events-list"
import type { Event } from "@/lib/types"
import { Suspense } from "react"

async function JudgeContent() {
  let events: Event[] = []
  try {
    events = await getJudgeEvents()
  } catch (error) {
    console.error("Error al cargar eventos para el juez:", error)
    return <p className="text-red-500">Error al cargar tus eventos.</p>
  }

  const activeEvents = events.filter(e => e.is_active === 1 || e.is_active === true)

  return <JudgeEventsList events={activeEvents} />
}

export default function JudgeDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-950">Panel de Evaluación</h1>
            <p className="text-slate-600">Selecciona un evento para calificar o registrar sanciones.</p>
        </div>
      </div>

      <Suspense fallback={
        <div className="space-y-4">
          <p className="text-slate-500 animate-pulse">Cargando tus eventos asignados...</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {[1,2,3].map(i => <div key={i} className="h-32 w-full bg-slate-100 rounded-lg animate-pulse" />)}
          </div>
        </div>
      }>
        <JudgeContent />
      </Suspense>
    </div>
  )
}