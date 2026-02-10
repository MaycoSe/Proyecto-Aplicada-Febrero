import { getJudgeEvents } from "@/lib/api"
import { JudgeEventsList } from "@/components/judge-events-list"
import type { Event } from "@/lib/types"

export default async function JudgeDashboard() {
  // 1. Obtener eventos reales desde el servidor
  let events: Event[] = []
  
  try {
    events = await getJudgeEvents()
  } catch (error) {
    console.error("Error al cargar eventos para el juez:", error)
  }

  // Filtrar solo los activos antes de enviarlos al cliente
  // (Esto es seguridad extra, aunque el backend ya debería filtrarlos)
  const activeEvents = events.filter(e => e.is_active === 1 || e.is_active === true)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-950">Panel de Evaluación</h1>
            <p className="text-slate-600">Selecciona un evento para calificar o registrar sanciones.</p>
        </div>
        {/* Aquí podrías poner un badge con el nombre del juez si quisieras */}
      </div>

      {/* 2. Pasamos los datos al componente interactivo */}
      <JudgeEventsList events={activeEvents} />
    </div>
  )
}