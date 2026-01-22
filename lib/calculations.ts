import type { Club, Event, Score, Sanction, ClubRanking } from "./types"

/**
 * Calcula el ranking global de todos los clubes activos.
 * Aplica la fórmula: (Suma de Puntajes * Peso del Evento) - Puntos de Sanción
 */
export function calculateRankings(
  clubs: Club[],
  events: Event[],
  scores: Score[],
  sanctions: Sanction[]
): ClubRanking[] {
  const rankings: ClubRanking[] = []

  for (const club of clubs) {
    if (!club.isActive) continue

    // 1. Calcular puntajes positivos (considerando el peso del evento)
    let totalScore = 0
    const clubScores = scores.filter((s) => s.clubId === club.id)

    for (const score of clubScores) {
      const event = events.find((e) => e.id === score.eventId)
      if (event && event.isActive) {
        // Si el evento tiene un peso específico (ej: vale doble), se aplica aquí
        // Por defecto el peso suele ser 1
        const weight = event.weight > 0 ? event.weight : 1
        totalScore += score.score * weight
      }
    }

    // 2. Calcular deducciones por sanciones
    const clubSanctions = sanctions.filter((s) => s.clubId === club.id)
    const totalDeductions = clubSanctions.reduce((sum, s) => sum + s.pointsDeducted, 0)

    // 3. Calcular puntaje final (no permitimos negativos para evitar problemas visuales, opcional)
    const finalScore = Math.max(0, totalScore - totalDeductions)

    rankings.push({
      clubId: club.id,
      clubName: club.name,
      clubCode: club.code,
      totalScore, // Puntaje bruto ganado
      eventScores: totalScore, // Alias para compatibilidad
      sanctionDeductions: totalDeductions, // Total descontado
      finalScore, // El número que define al ganador
      rank: 0, // Se asigna después de ordenar
    })
  }

  // 4. Ordenar descendente (Mayor puntaje primero)
  rankings.sort((a, b) => b.finalScore - a.finalScore)

  // 5. Asignar posición (1º, 2º, 3º...)
  // Manejo de empates: Si tienen el mismo puntaje, deberían tener el mismo rango (lógica simple por ahora)
  rankings.forEach((ranking, index) => {
    ranking.rank = index + 1
  })

  return rankings
}

/**
 * Obtiene estadísticas detalladas de un solo club para su perfil.
 * Útil para ver el desglose de inspecciones.
 */
export function getClubDetailedStats(
  clubId: string,
  clubs: Club[],
  events: Event[],
  scores: Score[],
  sanctions: Sanction[]
) {
  const club = clubs.find((c) => c.id === clubId)
  if (!club) return null

  const clubScores = scores.filter((s) => s.clubId === clubId)
  const clubSanctions = sanctions.filter((s) => s.clubId === clubId)

  // Desglose evento por evento
  const eventBreakdown = clubScores.map((score) => {
    const event = events.find((e) => e.id === score.eventId)
    return {
      id: event?.id,
      eventName: event?.name || "Evento Desconocido",
      eventType: event?.eventType || "General",
      evaluationType: event?.evaluationType || "standard",
      score: score.score,
      weight: event?.weight || 1,
      weightedScore: score.score * (event?.weight || 1),
      // Detalles específicos
      creativityScore: score.creativityScore,
      executionScore: score.executionScore,
      presentationScore: score.presentationScore,
      details: score.details, // Aquí van los items de inspección
      notes: score.notes,
    }
  })

  // Totales
  const totalEvents = clubScores.length
  const averageScore = totalEvents > 0 
    ? clubScores.reduce((sum, s) => sum + s.score, 0) / totalEvents 
    : 0
  
  const totalDeductions = clubSanctions.reduce((sum, s) => sum + s.pointsDeducted, 0)

  return {
    club,
    eventBreakdown,
    sanctions: clubSanctions,
    totalEvents,
    averageScore,
    totalDeductions
  }
}