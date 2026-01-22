export type UserRole = "admin" | "judge"

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
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  name: string
  eventType: string
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
  creativityScore?: number
  executionScore?: number
  presentationScore?: number
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
  userAgent?: string
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
