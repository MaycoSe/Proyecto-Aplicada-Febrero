import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { calculateRankings } from "@/lib/calculations"
import { Trophy, TrendingUp, Calendar } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PublicRankingsPage() {
  const rankings = calculateRankings()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900">Camp Score</h1>
            <p className="mt-2 text-slate-600">Live Competition Rankings</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Current Leader</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{rankings[0]?.clubName || "N/A"}</div>
              <p className="mt-1 text-xs text-slate-500">{rankings[0]?.finalScore.toFixed(2)} points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Competing Clubs</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{rankings.length}</div>
              <p className="mt-1 text-xs text-slate-500">Active participants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Last Updated</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">Live</div>
              <p className="mt-1 text-xs text-slate-500">Real-time updates</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Overall Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rankings.map((ranking, index) => (
                <div
                  key={ranking.clubId}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-all ${
                    index === 0
                      ? "border-yellow-300 bg-yellow-50"
                      : index === 1
                        ? "border-slate-300 bg-slate-50"
                        : index === 2
                          ? "border-amber-300 bg-amber-50"
                          : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white font-bold text-slate-900 shadow-sm">
                      {index === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
                      {index === 1 && <Trophy className="h-6 w-6 text-slate-400" />}
                      {index === 2 && <Trophy className="h-6 w-6 text-amber-700" />}
                      {index > 2 && <span>#{ranking.rank}</span>}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{ranking.clubName}</h3>
                      <p className="text-sm text-slate-600">{ranking.clubCode}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden text-right md:block">
                      <p className="text-sm text-slate-600">Event Scores</p>
                      <p className="font-semibold text-green-600">+{ranking.eventScores.toFixed(2)}</p>
                    </div>
                    {ranking.sanctionDeductions > 0 && (
                      <div className="hidden text-right md:block">
                        <p className="text-sm text-slate-600">Sanctions</p>
                        <p className="font-semibold text-red-600">-{ranking.sanctionDeductions.toFixed(2)}</p>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Final Score</p>
                      <Badge variant="default" className="mt-1 text-lg font-bold">
                        {ranking.finalScore.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Rankings update automatically as scores are recorded</p>
        </div>
      </main>
    </div>
  )
}
