"use server"

import type { AuditLog } from "./types"
import { mockAuditLogs } from "./mock-data"
import { getCurrentUser } from "./auth"

export async function createAuditLog(
  action: string,
  entityType: string,
  entityId: string,
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>,
): Promise<void> {
  const user = await getCurrentUser()

  const auditLog: AuditLog = {
    id: `audit-${Date.now()}`,
    userId: user?.id,
    action,
    entityType,
    entityId,
    oldValues,
    newValues,
    createdAt: new Date().toISOString(),
  }

  // In production, save to database
  mockAuditLogs.push(auditLog)
  console.log("[v0] Audit log created:", auditLog)
}

export async function getAuditLogs(filters?: {
  userId?: string
  entityType?: string
  action?: string
  startDate?: string
  endDate?: string
}): Promise<AuditLog[]> {
  let logs = [...mockAuditLogs]

  if (filters?.userId) {
    logs = logs.filter((log) => log.userId === filters.userId)
  }

  if (filters?.entityType) {
    logs = logs.filter((log) => log.entityType === filters.entityType)
  }

  if (filters?.action) {
    logs = logs.filter((log) => log.action === filters.action)
  }

  if (filters?.startDate) {
    logs = logs.filter((log) => new Date(log.createdAt) >= new Date(filters.startDate!))
  }

  if (filters?.endDate) {
    logs = logs.filter((log) => new Date(log.createdAt) <= new Date(filters.endDate!))
  }

  // Sort by most recent first
  logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return logs
}

export function getActionColor(action: string): string {
  switch (action) {
    case "CREATE":
      return "text-green-600 bg-green-50 border-green-200"
    case "UPDATE":
      return "text-blue-600 bg-blue-50 border-blue-200"
    case "DELETE":
      return "text-red-600 bg-red-50 border-red-200"
    default:
      return "text-slate-600 bg-slate-50 border-slate-200"
  }
}
