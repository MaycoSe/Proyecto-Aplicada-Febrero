// Copia esto en lib/types.ts reemplazando el contenido anterior

export type UserRole = "admin" | "judge"
export type EvaluationType = "standard" | "inspection" // Nuevo: Diferencia el tipo de evento

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Club {
  id: string
  name: string
  code: string
  description?: string
  is_active: boolean | number // Acepta tanto boolean como número (0 o 1)
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  name: string
  eventType: string
  evaluationType: EvaluationType // Nuevo: Define qué formulario mostrar
  description?: string
  maxScore: number
  weight: number
  startDate?: string
  endDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Score {
  id: string
  clubId: string
  eventId: string
  judgeId: string
  score: number
  // Campos para eventos estándar
  creativityScore?: number
  executionScore?: number
  presentationScore?: number
  // Campo nuevo para guardar los 10 ítems de inspección en formato JSON
  details?: Record<string, number> 
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Sanction {
  id: string
  clubId: string
  eventId?: string
  judgeId: string
  sanctionType: string
  description: string
  pointsDeducted: number
  appliedAt: string
}

export interface AuditLog {
  id: string
  userId?: string
  action: string
  entityType: string
  entityId?: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  ipAddress?: string
  userAgent?: string // Importante para el requisito 3.1.12 (Auditoría de dispositivo)
  createdAt: string
}

export interface ClubRanking {
  clubId: string
  clubName: string
  clubCode: string
  totalScore: number
  eventScores: number
  sanctionDeductions: number
  finalScore: number
  rank: number
}

export interface Event {
  id: string
  name: string
  // ... tus otros campos
  assignedJudges?: string[] // <--- Agrega esto
}