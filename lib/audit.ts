import { headers } from "next/headers"
import type { AuditLog } from "./types"
import { mockAuditLogs } from "./mock-data"

export async function createAuditLog(data: {
  userId: string
  action: string
  entityType: string
  entityId: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
}): Promise<void> {
  
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || 'Dispositivo Desconocido'
  // Capturamos la IP real
  const ipAddress = (headersList.get('x-forwarded-for') || '127.0.0.1').split(',')[0]

  const auditLog: AuditLog = {
    id: `audit-${Date.now()}`,
    userId: data.userId,
    action: data.action,
    entityType: data.entityType,
    entityId: data.entityId,
    oldValues: data.oldValues,
    newValues: data.newValues,
    ipAddress: ipAddress,
    userAgent: userAgent,
    createdAt: new Date().toISOString(),
  }

  mockAuditLogs.push(auditLog)
  // Ordenar por fecha reciente
  mockAuditLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  
  console.log("🔒 [AUDIT]", `User: ${data.userId} | Action: ${data.action} | IP: ${ipAddress}`)
}

export async function getAuditLogs(filters?: {
  userId?: string
  entityType?: string
  action?: string
  startDate?: string
  endDate?: string
}): Promise<AuditLog[]> {
  let logs = [...mockAuditLogs]

  if (filters?.userId) logs = logs.filter((log) => log.userId === filters.userId)
  if (filters?.entityType) logs = logs.filter((log) => log.entityType === filters.entityType)
  if (filters?.action) logs = logs.filter((log) => log.action === filters.action)
  
  // Ordenar siempre cronológicamente inverso
  logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return logs
}

export function getActionColor(action: string): string {
  switch (action) {
    case "CREATE":
      return "bg-green-100 text-green-700 border-green-200"
    case "UPDATE":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "DELETE":
      return "bg-red-100 text-red-700 border-red-200"
    case "LOGIN":
      return "bg-purple-100 text-purple-700 border-purple-200"
    case "SANCTION":
      return "bg-orange-100 text-orange-800 border-orange-200"
    default:
      return "bg-slate-100 text-slate-600 border-slate-200"
  }
}