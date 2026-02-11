export const dynamic = 'force-dynamic'; // <--- AGREGÁ ESTO

import { requireAdmin, getAuthToken } from "@/lib/auth"
import { ReportsView } from "@/components/reports-view" 

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

// Definimos la forma exacta de los datos que devuelve tu nuevo Backend
export interface RankingItem {
  id: number
  name: string
  code: string
  events_score: number      // Puntos ganados por eventos (ya multiplicados por peso)
  sanctions_penalty: number // Puntos restados
  total_score: number       // El total final
}

async function getRankingData(): Promise<RankingItem[]> {
  const token = await getAuthToken()
  
  try {
    // Llamamos al endpoint que devuelve el array ya calculado y ordenado
    const res = await fetch(`${API_URL}/ranking`, {
      headers: { 
        "Authorization": `Bearer ${token}`, 
        "Accept": "application/json" 
      },
      cache: "no-store" // Importante: No guardar caché para ver cambios al instante
    })

    if (!res.ok) throw new Error("Error fetching ranking data")

    const data = await res.json()
    return data as RankingItem[]

  } catch (error) {
    console.error("Error cargando ranking:", error)
    return []
  }
}

export default async function ReportsPage() {
  const user = await requireAdmin()
  
  // 1. Obtenemos el ranking listo del servidor
  const rankingData = await getRankingData()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-blue-950">Ranking Oficial</h1>
           <p className="text-slate-600">Posiciones calculadas en tiempo real.</p>
        </div>
      </div>

      {/* 2. Se lo pasamos a la vista */}
      <ReportsView ranking={rankingData} />
    </div>
  )
}