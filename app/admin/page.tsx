import { requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockClubs, mockEvents, mockScores, mockUsers } from "@/lib/mock-data"
import { Trophy, Calendar, Users, TrendingUp, FileText } from "lucide-react"

export default async function AdminDashboard() {
  const user = await requireAdmin()

  const stats = {
    totalClubs: mockClubs.filter((c) => c.isActive).length,
    totalEvents: mockEvents.filter((e) => e.isActive).length,
    totalJudges: mockUsers.filter((u) => u.role === "judge" && u.isActive).length,
    totalScores: mockScores.length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">Welcome back, {user.fullName}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Clubs</CardTitle>
            <Trophy className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalClubs}</div>
            <p className="mt-1 text-xs text-slate-500">Active clubs competing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalEvents}</div>
            <p className="mt-1 text-xs text-slate-500">Events in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Judges</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalJudges}</div>
            <p className="mt-1 text-xs text-slate-500">Active judges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Scores</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalScores}</div>
            <p className="mt-1 text-xs text-slate-500">Scores recorded</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <a
            href="/admin/clubs"
            className="flex flex-col gap-2 rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
          >
            <Trophy className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Manage Clubs</h3>
            <p className="text-sm text-slate-600">Add, edit, or remove clubs</p>
          </a>

          <a
            href="/admin/events"
            className="flex flex-col gap-2 rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
          >
            <Calendar className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Manage Events</h3>
            <p className="text-sm text-slate-600">Create and configure events</p>
          </a>

          <a
            href="/admin/reports"
            className="flex flex-col gap-2 rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
          >
            <FileText className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-slate-900">View Reports</h3>
            <p className="text-sm text-slate-600">Rankings and statistics</p>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
