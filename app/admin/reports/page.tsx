import { requireAdmin, getAuthToken } from "@/lib/auth"
import { ReportsView } from "@/components/reports-view" // <--- Importamos el componente que creamos arriba

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

async function getRawReportData() {
  const token = await getAuthToken()
  
  try {
    // Usamos el endpoint de ranking que devuelve TODO crudo
    const res = await fetch(`${API_URL}/ranking`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      cache: "no-store" 
    })

    if (!res.ok) throw new Error("Error fetching data")

    const data = await res.json()

    // Mapeo de datos (BD -> Frontend Format)
    const clubs = data.clubs.map((c: any) => ({
      id: c.id.toString(),
      name: c.name,
      code: c.code
    }))

    const events = data.events.map((e: any) => ({
      id: e.id.toString(),
      name: e.name,
      // Si tu motor de cálculo usa pesos, agrégalos aquí:
      // weight: Number(e.weight) || 1
    }))

    const scores = data.scores.map((s: any) => ({
      clubId: s.club_id.toString(),
      eventId: s.event_id.toString(),
      value: Number(s.score), // Leemos la columna score (o total_score)
      // Pasamos los detalles JSON para el desglose en el modal
      details: s.details || {},
      feedback: s.feedback
    }))

    const sanctions = data.sanctions.map((s: any) => ({
      clubId: s.club_id.toString(),
      pointsDeducted: Number(s.points_deducted)
    }))

    return { clubs, events, scores, sanctions }

  } catch (error) {
    console.error("Error cargando datos de reporte:", error)
    return { clubs: [], events: [], scores: [], sanctions: [] }
  }
}

export default async function ReportsPage() {
  await requireAdmin()
  
  // 1. Obtenemos datos frescos
  const rawData = await getRawReportData()

  // 2. Renderizamos la vista cliente pasándole los datos
  return (
    <ReportsView 
      clubs={rawData.clubs}
      events={rawData.events}
      scores={rawData.scores}
      sanctions={rawData.sanctions}
    />
  )
}