import { requireAdmin, getAuthToken } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button" 
import { Trophy, Calendar, Users, TrendingUp, FileText, ArrowRight, AlertTriangle, UserPlus } from "lucide-react"
import Link from "next/link"
import { SystemResetControls } from "@/components/system-reset-controls"

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
      cache: "no-store",
    })

    if (!res.ok) throw new Error("Error fetching stats")

    return await res.json()
  } catch (error) {
    console.error(error)
    // Retornamos estructura segura por defecto
    return { 
        total_clubs: 0, 
        total_events: 0, 
        total_judges: 0, 
        total_scores: 0,
        pending_events: [] // Array vacío para que no falle la alerta
    }
  }
}

export default async function AdminDashboard() {
  const user = await requireAdmin()
  const data = await getDashboardStats()

  // Mapeamos la respuesta del backend
  const stats = {
    totalClubs: data.total_clubs,
    totalEvents: data.total_events,
    totalJudges: data.total_judges,
    totalScores: data.total_scores,
    // Lista de eventos sin jueces (viene del backend)
    pendingEvents: data.pending_events || [] 
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-blue-950">Panel de Control</h1>
        <p className="mt-1 text-slate-600">Bienvenido de nuevo, <span className="font-semibold text-blue-700">{user.fullName}</span>.</p>
      </div>

      {/* --- NUEVA ZONA DE ALERTAS --- */}
      {/* Solo se muestra si hay eventos sin jueces */}
      {stats.pendingEvents.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 rounded-full shrink-0">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-orange-800">Atención Requerida</h3>
                    <p className="text-sm text-orange-700 mb-3">
                        Hay <span className="font-bold">{stats.pendingEvents.length} eventos activos</span> que no tienen jueces asignados. 
                        Estos eventos no podrán ser calificados.
                    </p>
                    
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {stats.pendingEvents.map((evt: any) => (
                            <div key={evt.id} className="flex items-center justify-between bg-white p-3 rounded border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-sm font-medium text-slate-700 truncate mr-2" title={evt.name}>
                                    {evt.name}
                                </span>
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 text-xs border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800" 
                                    asChild
                                >
                                    <Link href={`/admin/events/${evt.id}/judges`}>
                                        <UserPlus className="h-3 w-3 mr-1" /> Asignar
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

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
      <Card className="border-t-4 border-t-slate-700 shadow-md">
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/clubs"
            className="group flex flex-col gap-2 rounded-lg border border-slate-200 p-4 transition-all hover:bg-blue-50 hover:border-blue-200 bg-white shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors">
                    <Trophy className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mt-2">Gestionar Clubes</h3>
            <p className="text-sm text-slate-500">Dar de alta, editar o desactivar clubes.</p>
          </Link>

          <Link
            href="/admin/events"
            className="group flex flex-col gap-2 rounded-lg border border-slate-200 p-4 transition-all hover:bg-blue-50 hover:border-blue-200 bg-white shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start">
                 <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors">
                    <Calendar className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mt-2">Gestionar Eventos</h3>
            <p className="text-sm text-slate-500">Crear eventos, asignar jueces y criterios.</p>
          </Link>

          <Link
            href="/admin/reports"
            className="group flex flex-col gap-2 rounded-lg border border-slate-200 p-4 transition-all hover:bg-blue-50 hover:border-blue-200 bg-white shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors">
                    <FileText className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mt-2">Ver Ranking Oficial</h3>
            <p className="text-sm text-slate-500">Consultar tabla de posiciones en tiempo real.</p>
          </Link>
        </CardContent>
      </Card>

      {/* CONTROLES DE LIMPIEZA */}
      <SystemResetControls />
    </div>
  )
}