import type { ClubRanking } from "./types"
import { mockClubs, mockScores, mockSanctions, mockEvents } from "./mock-data"

export function calculateRankings(): ClubRanking[] {
  const rankings: ClubRanking[] = []

  for (const club of mockClubs) {
    if (!club.isActive) continue

    // Calculate total weighted scores
    let totalScore = 0
    const clubScores = mockScores.filter((s) => s.clubId === club.id)

    for (const score of clubScores) {
      const event = mockEvents.find((e) => e.id === score.eventId)
      if (event && event.isActive) {
        totalScore += score.score * event.weight
      }
    }

    // Calculate total sanction deductions
    const clubSanctions = mockSanctions.filter((s) => s.clubId === club.id)
    const totalDeductions = clubSanctions.reduce((sum, s) => sum + s.pointsDeducted, 0)

    // Calculate final score
    const finalScore = Math.max(0, totalScore - totalDeductions)

    rankings.push({
      clubId: club.id,
      clubName: club.name,
      clubCode: club.code,
      totalScore,
      eventScores: totalScore,
      sanctionDeductions: totalDeductions,
      finalScore,
      rank: 0, // Will be set after sorting
    })
  }

  // Sort by final score (descending) and assign ranks
  rankings.sort((a, b) => b.finalScore - a.finalScore)
  rankings.forEach((ranking, index) => {
    ranking.rank = index + 1
  })

  return rankings
}

export function getClubDetailedStats(clubId: string) {
  const club = mockClubs.find((c) => c.id === clubId)
  if (!club) return null

  const clubScores = mockScores.filter((s) => s.clubId === clubId)
  const clubSanctions = mockSanctions.filter((s) => s.clubId === clubId)

  const eventBreakdown = clubScores.map((score) => {
    const event = mockEvents.find((e) => e.id === score.eventId)
    return {
      eventName: event?.name || "Unknown",
      eventType: event?.eventType || "Unknown",
      score: score.score,
      weight: event?.weight || 1,
      weightedScore: score.score * (event?.weight || 1),
      creativityScore: score.creativityScore,
      executionScore: score.executionScore,
      presentationScore: score.presentationScore,
      notes: score.notes,
    }
  })

  return {
    club,
    eventBreakdown,
    sanctions: clubSanctions,
    totalEvents: clubScores.length,
    averageScore: clubScores.length > 0 ? clubScores.reduce((sum, s) => sum + s.score, 0) / clubScores.length : 0,
  }
}
