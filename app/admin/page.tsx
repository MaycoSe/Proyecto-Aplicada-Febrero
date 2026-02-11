export const dynamic = 'force-dynamic';

import { requireAdmin, getAuthToken } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button" 
import { Trophy, Calendar, Users, TrendingUp, FileText, ArrowRight, AlertTriangle, UserPlus } from "lucide-react"
import Link from "next/link"
import { SystemResetControls } from "@/components/system-reset-controls"
import { Suspense } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

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
    return { total_clubs: 0, total_events: 0, total_judges: 0, total_scores: 0, pending_events: [] }
  }
}

// Subcomponente que maneja la lógica dinámica
async function DashboardContent() {
  const user = await requireAdmin()
  const data = await getDashboardStats()

  const stats = {
    totalClubs: data.total_clubs,
    totalEvents: data.total_events,
    totalJudges: data.total_judges,
    totalScores: data.total_scores,
    pendingEvents: data.pending_events || [] 
  }

  return (
    <>
      {/* ZONA DE ALERTAS */}
      {stats.pendingEvents.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg shadow-sm mb-6">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 rounded-full shrink-0">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-orange-800">Atención Requerida</h3>
                    <p className="text-sm text-orange-700 mb-3">
                        Hay <span className="font-bold">{stats.pendingEvents.length} eventos activos</span> sin jueces.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {stats.pendingEvents.map((evt: any) => (
                            <div key={evt.id} className="flex items-center justify-between bg-white p-3 rounded border border-orange-200 shadow-sm">
                                <span className="text-sm font-medium text-slate-700 truncate mr-2">{evt.name}</span>
                                <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
                                    <Link href={`/admin/events/${evt.id}/judges`}><UserPlus className="h-3 w-3 mr-1" /> Asignar</Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title="Clubes Activos" value={stats.totalClubs} icon={<Trophy className="h-4 w-4 text-blue-500" />} color="blue" subtitle="Compitiendo" />
        <StatCard title="Eventos en Curso" value={stats.totalEvents} icon={<Calendar className="h-4 w-4 text-green-500" />} color="green" subtitle="Habilitados" />
        <StatCard title="Jueces Activos" value={stats.totalJudges} icon={<Users className="h-4 w-4 text-purple-500" />} color="purple" subtitle="Disponibles" />
        <StatCard title="Evaluaciones" value={stats.totalScores} icon={<TrendingUp className="h-4 w-4 text-orange-500" />} color="orange" subtitle="Procesados" />
      </div>

      {/* BIENVENIDA ABAJO PARA QUE NO BLOQUEE */}
      <p className="text-slate-600 mb-6 text-sm">Sesión iniciada como: <span className="font-semibold text-blue-700">{user.fullName}</span></p>
    </>
  )
}

// Auxiliar para no repetir código de tarjetas
function StatCard({ title, value, icon, color, subtitle }: any) {
    const borders: any = { blue: 'border-l-blue-600', green: 'border-l-green-600', purple: 'border-l-purple-600', orange: 'border-l-orange-500' }
    return (
        <Card className={`border-l-4 ${borders[color]} shadow-sm`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
            {icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          </CardContent>
        </Card>
    )
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-blue-950">Panel de Control</h1>

      <Suspense fallback={<div className="h-40 w-full bg-slate-100 animate-pulse rounded-lg" />}>
        <DashboardContent />
      </Suspense>

      {/* ACCESOS RÁPIDOS (Son estáticos, pueden estar fuera del Suspense) */}
      <Card className="border-t-4 border-t-slate-700 shadow-md">
        <CardHeader><CardTitle>Accesos Rápidos</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <QuickLink href="/admin/clubs" title="Gestionar Clubes" desc="Alta y edición" icon={<Trophy className="h-6 w-6 text-blue-600" />} />
          <QuickLink href="/admin/events" title="Gestionar Eventos" desc="Asignar jueces" icon={<Calendar className="h-6 w-6 text-blue-600" />} />
          <QuickLink href="/admin/reports" title="Ver Ranking" desc="Tabla en tiempo real" icon={<FileText className="h-6 w-6 text-blue-600" />} />
        </CardContent>
      </Card>
      <SystemResetControls />
    </div>
  )
}

function QuickLink({ href, title, desc, icon }: any) {
    return (
        <Link href={href} className="group flex flex-col gap-2 rounded-lg border border-slate-200 p-4 transition-all hover:bg-blue-50 hover:border-blue-200 bg-white">
            <div className="flex justify-between items-start">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors text-blue-600 group-hover:text-white">{icon}</div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mt-2">{title}</h3>
            <p className="text-sm text-slate-500">{desc}</p>
        </Link>
    )
}