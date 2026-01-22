import { requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockClubs, mockEvents, mockScores, mockUsers } from "@/lib/mock-data"
import { Trophy, Calendar, Users, TrendingUp, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const user = await requireAdmin()

  const stats = {
    totalClubs: mockClubs.filter((c) => c.isActive).length,
    totalEvents: mockEvents.filter((e) => e.isActive).length,
    totalJudges: mockUsers.filter((u) => u.role === "judge" && u.isActive).length,
    totalScores: mockScores.length,
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
            <CardTitle className="text-sm font-medium text-slate-600">Jueces</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalJudges}</div>
            <p className="mt-1 text-xs text-slate-500">Evaluadores registrados</p>
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