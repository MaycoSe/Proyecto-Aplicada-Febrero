// import type { Club, Event, Score, Sanction, ClubRanking } from "./types"

// /**
//  * Calcula el ranking global de todos los clubes activos.
//  * Aplica la fórmula: (Suma de Puntajes * Peso del Evento) - Puntos de Sanción
//  */
// export function calculateRankings(
//   clubs: Club[],
//   events: Event[],
//   scores: Score[],
//   sanctions: Sanction[]
// ): ClubRanking[] {
//   const rankings: ClubRanking[] = []

//   for (const club of clubs) {
//     if (!club.isActive) continue

//     // 1. Calcular puntajes positivos (considerando el peso del evento)
//     let totalScore = 0
//     const clubScores = scores.filter((s) => s.clubId === club.id)

//     for (const score of clubScores) {
//       const event = events.find((e) => e.id === score.eventId)
//       if (event && event.isActive) {
//         // Si el evento tiene un peso específico (ej: vale doble), se aplica aquí
//         // Por defecto el peso suele ser 1
//         const weight = event.weight > 0 ? event.weight : 1
//         totalScore += score.score * weight
//       }
//     }

//     // 2. Calcular deducciones por sanciones
//     const clubSanctions = sanctions.filter((s) => s.clubId === club.id)
//     const totalDeductions = clubSanctions.reduce((sum, s) => sum + s.pointsDeducted, 0)

//     // 3. Calcular puntaje final (no permitimos negativos para evitar problemas visuales, opcional)
//     const finalScore = Math.max(0, totalScore - totalDeductions)

//     rankings.push({
//       clubId: club.id,
//       clubName: club.name,
//       clubCode: club.code,
//       totalScore, // Puntaje bruto ganado
//       eventScores: totalScore, // Alias para compatibilidad
//       sanctionDeductions: totalDeductions, // Total descontado
//       finalScore, // El número que define al ganador
//       rank: 0, // Se asigna después de ordenar
//     })
//   }

//   // 4. Ordenar descendente (Mayor puntaje primero)
//   rankings.sort((a, b) => b.finalScore - a.finalScore)

//   // 5. Asignar posición (1º, 2º, 3º...)
//   // Manejo de empates: Si tienen el mismo puntaje, deberían tener el mismo rango (lógica simple por ahora)
//   rankings.forEach((ranking, index) => {
//     ranking.rank = index + 1
//   })

//   return rankings
// }

// /**
//  * Obtiene estadísticas detalladas de un solo club para su perfil.
//  * Útil para ver el desglose de inspecciones.
//  */
// export function getClubDetailedStats(
//   clubId: string,
//   clubs: Club[],
//   events: Event[],
//   scores: Score[],
//   sanctions: Sanction[]
// ) {
//   const club = clubs.find((c) => c.id === clubId)
//   if (!club) return null

//   const clubScores = scores.filter((s) => s.clubId === clubId)
//   const clubSanctions = sanctions.filter((s) => s.clubId === clubId)

//   // Desglose evento por evento
//   const eventBreakdown = clubScores.map((score) => {
//     const event = events.find((e) => e.id === score.eventId)
//     return {
//       id: event?.id,
//       eventName: event?.name || "Evento Desconocido",
//       eventType: event?.eventType || "General",
//       evaluationType: event?.evaluationType || "standard",
//       score: score.score,
//       weight: event?.weight || 1,
//       weightedScore: score.score * (event?.weight || 1),
//       // Detalles específicos
//       creativityScore: score.creativityScore,
//       executionScore: score.executionScore,
//       presentationScore: score.presentationScore,
//       details: score.details, // Aquí van los items de inspección
//       notes: score.notes,
//     }
//   })

//   // Totales
//   const totalEvents = clubScores.length
//   const averageScore = totalEvents > 0 
//     ? clubScores.reduce((sum, s) => sum + s.score, 0) / totalEvents 
//     : 0
  
//   const totalDeductions = clubSanctions.reduce((sum, s) => sum + s.pointsDeducted, 0)

//   return {
//     club,
//     eventBreakdown,
//     sanctions: clubSanctions,
//     totalEvents,
//     averageScore,
//     totalDeductions
//   }
// }


// lib/calculations.ts

// --- 1. Calcular Ranking General ---
// lib/calculations.ts

// lib/calculations.ts

// Helper para obtener el ID de forma segura (sea club_id o clubId)
// lib/calculations.ts

// Helper para obtener el ID de forma segura (sea club_id o clubId)
const getId = (item: any, field: string) => {
    // Lee snake_case (club_id) o camelCase (clubId)
    const val = item[field] || item[field.replace(/_([a-z])/g, (g: any) => g[1].toUpperCase())];
    return String(val || "");
}

// Helper para obtener el puntaje (sea score o value)
const getScoreValue = (item: any) => {
    const val = item.score !== undefined ? item.score : item.value;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
}

// --- CORRECCIÓN AQUÍ ---
const getSanctionValue = (item: any) => {
    // Buscamos todas las variantes posibles:
    // 1. points_deducted (Laravel original)
    // 2. pointsDeducted (Posible transformación del frontend)
    // 3. points, discount, amount (Fallbacks)
    const val = item.points_deducted || item.pointsDeducted || item.points || item.discount || item.amount;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
}

// --- 1. Calcular Ranking General ---
export function calculateRankings(clubs: any[], events: any[], scores: any[], sanctions: any[]) {
    if (!clubs || !Array.isArray(clubs)) return []
  
    const safeScores = Array.isArray(scores) ? scores : []
    const safeSanctions = Array.isArray(sanctions) ? sanctions : []

    const rankings = clubs.map(club => {
      // A. Sumar puntajes de eventos
      const clubScores = safeScores.filter(s => getId(s, 'club_id') === String(club.id))
      
      const eventScores = clubScores.reduce((acc, curr) => {
        return acc + getScoreValue(curr) 
      }, 0)
  
      // B. Sumar sanciones
      const clubSanctions = safeSanctions.filter(s => getId(s, 'club_id') === String(club.id))
      
      const sanctionDeductions = clubSanctions.reduce((acc, curr) => {
        return acc + getSanctionValue(curr)
      }, 0)
  
      // C. Total Final
      const finalVal = eventScores - sanctionDeductions
      
      return {
        clubId: club.id,
        clubName: club.name,
        clubCode: club.code,
        eventScores: eventScores,
        sanctionDeductions: sanctionDeductions,
        finalScore: finalVal, 
        totalScore: finalVal 
      }
    })
  
    return rankings.sort((a, b) => b.finalScore - a.finalScore).map((item, index) => ({
      ...item,
      rank: index + 1
    }))
}
  
// --- 2. Obtener Detalles de un Club Específico ---
export function getClubDetailedStats(clubId: string, clubs: any[], events: any[], scores: any[], sanctions: any[]) {
    const targetId = String(clubId)
    const club = clubs.find(c => String(c.id) === targetId)
    
    if (!club) return null
  
    const safeScores = Array.isArray(scores) ? scores : []
    const safeSanctions = Array.isArray(sanctions) ? sanctions : []

    const clubScores = safeScores.filter(s => getId(s, 'club_id') === targetId)
    const clubSanctions = safeSanctions.filter(s => getId(s, 'club_id') === targetId)
  
    // Calcular deducciones usando el helper robusto
    const totalDeductions = clubSanctions.reduce((acc, curr) => {
        return acc + getSanctionValue(curr)
    }, 0)
  
    const eventBreakdown = events.map(event => {
      const scoreRecord = clubScores.find(s => getId(s, 'event_id') === String(event.id))
  
      let parsedDetails = null
      try {
        if (scoreRecord && scoreRecord.details) {
            parsedDetails = typeof scoreRecord.details === 'string' 
                ? JSON.parse(scoreRecord.details) 
                : scoreRecord.details
        }
      } catch (e) { console.error(e) }

      const numericScore = scoreRecord ? getScoreValue(scoreRecord) : 0;
  
      return {
        eventId: event.id,
        eventName: event.name,
        evaluationType: event.evaluation_type || event.evaluationType, 
        score: numericScore,
        hasScore: !!scoreRecord,
        details: parsedDetails,
        notes: scoreRecord?.feedback || "",
        creativityScore: parsedDetails?.creativity,
        executionScore: parsedDetails?.execution,
        presentationScore: parsedDetails?.presentation
      }
    })
  
    const sortedBreakdown = eventBreakdown.sort((a, b) => {
        if (a.hasScore && !b.hasScore) return -1
        if (!a.hasScore && b.hasScore) return 1
        return 0
    })
  
    return {
      club,
      totalEvents: sortedBreakdown.filter(e => e.hasScore).length,
      totalDeductions,
      eventBreakdown: sortedBreakdown
    }
}