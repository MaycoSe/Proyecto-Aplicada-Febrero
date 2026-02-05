import { requireAdmin, getAuthToken } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Calendar, Users, TrendingUp, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

// URL de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

// Función para obtener las estadísticas reales
async function getDashboardStats() {
  const token = await getAuthToken()
  
  try {
    const res = await fetch(`${API_URL}/dashboard/stats`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
      cache: "no-store", // Para ver los números cambiar al instante
    })

    if (!res.ok) throw new Error("Error fetching stats")

    return await res.json()
  } catch (error) {
    console.error(error)
    // Retornamos ceros por defecto si falla, para que no explote la pantalla
    return { total_clubs: 0, total_events: 0, total_judges: 0, total_scores: 0 }
  }
}

export default async function AdminDashboard() {
  const user = await requireAdmin()
  
  // LLAMADA A LA BASE DE DATOS REAL
  const data = await getDashboardStats()

  // Mapeamos la respuesta del backend a tu objeto stats
  const stats = {
    totalClubs: data.total_clubs,
    totalEvents: data.total_events,
    totalJudges: data.total_judges,
    totalScores: data.total_scores,
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-blue-950">Panel de Control</h1>
        <p className="mt-1 text-slate-600">Bienvenido de nuevo, <span className="font-semibold text-blue-700">{user.fullName}</span>.</p>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Clubes Activos</CardTitle>
            <Trophy className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalClubs}</div>
            <p className="mt-1 text-xs text-slate-500">Compitiendo actualmente</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Eventos en Curso</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalEvents}</div>
            <p className="mt-1 text-xs text-slate-500">Actividades habilitadas</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Jueces Activos</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalJudges}</div>
            <p className="mt-1 text-xs text-slate-500">Evaluadores disponibles</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Evaluaciones</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalScores}</div>
            <p className="mt-1 text-xs text-slate-500">Puntajes procesados</p>
          </CardContent>
        </Card>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <Card className="border-t-4 border-t-slate-700">
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/clubs"
            className="group flex flex-col gap-2 rounded-lg border border-slate-200 p-4 transition-all hover:bg-blue-50 hover:border-blue-200"
          >
            <div className="flex justify-between items-start">
                <Trophy className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                <ArrowRight className="h-4 w-4 text-blue-300 group-hover:text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Gestionar Clubes</h3>
            <p className="text-sm text-slate-600">Dar de alta, editar o desactivar clubes.</p>
          </Link>

          <Link
            href="/admin/events"
            className="group flex flex-col gap-2 rounded-lg border border-slate-200 p-4 transition-all hover:bg-blue-50 hover:border-blue-200"
          >
            <div className="flex justify-between items-start">
                <Calendar className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                <ArrowRight className="h-4 w-4 text-blue-300 group-hover:text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Gestionar Eventos</h3>
            <p className="text-sm text-slate-600">Crear eventos e inspecciones.</p>
          </Link>

          <Link
            href="/admin/reports"
            className="group flex flex-col gap-2 rounded-lg border border-slate-200 p-4 transition-all hover:bg-blue-50 hover:border-blue-200"
          >
            <div className="flex justify-between items-start">
                <FileText className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                <ArrowRight className="h-4 w-4 text-blue-300 group-hover:text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Ver Ranking Oficial</h3>
            <p className="text-sm text-slate-600">Consultar tabla de posiciones y detalles.</p>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}