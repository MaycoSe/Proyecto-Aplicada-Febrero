import type { User, Club, Event, Score, Sanction, AuditLog } from "./types"

// Mock data for development (replace with actual database calls later)
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@camp.com",
    fullName: "System Administrator",
    role: "admin",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "judge1@camp.com",
    fullName: "John Smith",
    role: "judge",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "judge2@camp.com",
    fullName: "Sarah Johnson",
    role: "judge",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockClubs: Club[] = [
  {
    id: "c1",
    name: "Eagles Club",
    code: "EGL",
    description: "The mighty eagles soaring high",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c2",
    name: "Lions Club",
    code: "LNS",
    description: "Brave and fearless lions",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c3",
    name: "Tigers Club",
    code: "TGR",
    description: "Swift and powerful tigers",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c4",
    name: "Bears Club",
    code: "BRS",
    description: "Strong and resilient bears",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c5",
    name: "Wolves Club",
    code: "WLV",
    description: "Pack hunters with great teamwork",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockEvents: Event[] = [
  {
    id: "e1",
    name: "Opening Ceremony Performance",
    eventType: "Performance",
    description: "Grand opening ceremony showcase",
    maxScore: 100,
    weight: 1.5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "e2",
    name: "Team Building Challenge",
    eventType: "Challenge",
    description: "Collaborative problem-solving activity",
    maxScore: 100,
    weight: 1.0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "e3",
    name: "Sports Competition",
    eventType: "Sports",
    description: "Athletic events and competitions",
    maxScore: 100,
    weight: 1.25,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "e4",
    name: "Creative Arts Showcase",
    eventType: "Arts",
    description: "Display of artistic talents",
    maxScore: 100,
    weight: 1.0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockScores: Score[] = [
  {
    id: "s1",
    clubId: "c1",
    eventId: "e1",
    judgeId: "2",
    score: 92.5,
    creativityScore: 95,
    executionScore: 90,
    presentationScore: 93,
    notes: "Excellent performance",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s2",
    clubId: "c2",
    eventId: "e1",
    judgeId: "2",
    score: 88.0,
    creativityScore: 85,
    executionScore: 90,
    presentationScore: 89,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s3",
    clubId: "c3",
    eventId: "e1",
    judgeId: "2",
    score: 95.0,
    creativityScore: 98,
    executionScore: 92,
    presentationScore: 95,
    notes: "Outstanding creativity",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockSanctions: Sanction[] = [
  {
    id: "san1",
    clubId: "c2",
    eventId: "e1",
    judgeId: "2",
    sanctionType: "Late Arrival",
    description: "Team arrived 15 minutes late",
    pointsDeducted: 5.0,
    appliedAt: new Date().toISOString(),
  },
]

export const mockAuditLogs: AuditLog[] = [
  {
    id: "a1",
    userId: "1",
    action: "CREATE",
    entityType: "club",
    entityId: "c1",
    newValues: { name: "Eagles Club", code: "EGL" },
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "a2",
    userId: "2",
    action: "CREATE",
    entityType: "score",
    entityId: "s1",
    newValues: { clubId: "c1", eventId: "e1", score: 92.5 },
    createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
  },
  {
    id: "a3",
    userId: "2",
    action: "CREATE",
    entityType: "sanction",
    entityId: "san1",
    newValues: { clubId: "c2", sanctionType: "Late Arrival", pointsDeducted: 5.0 },
    createdAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
  },
  {
    id: "a4",
    userId: "1",
    action: "UPDATE",
    entityType: "event",
    entityId: "e1",
    oldValues: { weight: 1.0 },
    newValues: { weight: 1.5 },
    createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
  },
  {
    id: "a5",
    userId: "3",
    action: "CREATE",
    entityType: "score",
    entityId: "s3",
    newValues: { clubId: "c3", eventId: "e1", score: 95.0 },
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
]
