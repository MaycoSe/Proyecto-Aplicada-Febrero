import { requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { calculateRankings } from "@/lib/calculations"
import { Trophy, TrendingUp, TrendingDown, Download, Filter } from "lucide-react"

export default async function ReportsPage() {
  await requireAdmin()
  const rankings = calculateRankings()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Statistics</h1>
          <p className="mt-1 text-slate-600">Real-time rankings and detailed analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Leading Club</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{rankings[0]?.clubName || "N/A"}</div>
            <p className="mt-1 text-xs text-slate-500">{rankings[0]?.finalScore.toFixed(2)} points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {rankings.length > 0
                ? (rankings.reduce((sum, r) => sum + r.finalScore, 0) / rankings.length).toFixed(2)
                : "0.00"}
            </div>
            <p className="mt-1 text-xs text-slate-500">Across all clubs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Sanctions</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {rankings.reduce((sum, r) => sum + r.sanctionDeductions, 0).toFixed(2)}
            </div>
            <p className="mt-1 text-xs text-slate-500">Points deducted</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-left text-sm font-semibold text-slate-900">Rank</th>
                  <th className="pb-3 text-left text-sm font-semibold text-slate-900">Club</th>
                  <th className="pb-3 text-right text-sm font-semibold text-slate-900">Event Scores</th>
                  <th className="pb-3 text-right text-sm font-semibold text-slate-900">Sanctions</th>
                  <th className="pb-3 text-right text-sm font-semibold text-slate-900">Final Score</th>
                  <th className="pb-3 text-right text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((ranking) => (
                  <tr key={ranking.clubId} className="border-b border-slate-100">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {ranking.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                        {ranking.rank === 2 && <Trophy className="h-5 w-5 text-slate-400" />}
                        {ranking.rank === 3 && <Trophy className="h-5 w-5 text-amber-700" />}
                        <span className="font-semibold text-slate-900">#{ranking.rank}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{ranking.clubName}</p>
                        <p className="text-sm text-slate-500">{ranking.clubCode}</p>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className="font-medium text-green-600">+{ranking.eventScores.toFixed(2)}</span>
                    </td>
                    <td className="py-4 text-right">
                      {ranking.sanctionDeductions > 0 ? (
                        <span className="font-medium text-red-600">-{ranking.sanctionDeductions.toFixed(2)}</span>
                      ) : (
                        <span className="text-slate-400">0.00</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <Badge variant="default" className="font-semibold">
                        {ranking.finalScore.toFixed(2)}
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
