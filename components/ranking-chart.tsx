"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { ClubRanking } from "@/lib/types"

interface RankingChartProps {
  rankings: ClubRanking[]
}

export function RankingChart({ rankings }: RankingChartProps) {
  const data = rankings.map((r) => ({
    name: r.clubCode,
    "Event Scores": r.eventScores,
    Sanctions: -r.sanctionDeductions,
    "Final Score": r.finalScore,
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Event Scores" fill="#10b981" />
        <Bar dataKey="Sanctions" fill="#ef4444" />
        <Bar dataKey="Final Score" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  )
}
