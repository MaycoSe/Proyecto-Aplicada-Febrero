export const dynamic = 'force-dynamic'; // <--- AGREGÁ ESTO

import { requireAdmin, getAuthToken } from "@/lib/auth"
import { AuditLogsClient } from "@/components/audit-logs-client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

async function getAllAuditLogs() {
  const token = await getAuthToken()
  
  try {
    // Pedimos un lote grande (ej: 500) para paginar en el cliente
    const res = await fetch(`${API_URL}/audit-logs?per_page=500`, { 
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) return []

    // Manejo robusto de la respuesta (por si Laravel manda paginación o array directo)
    const json = await res.json()
    const rawData = json.data ? json.data : json 

    // Mapeo y limpieza de datos
    return rawData.map((log: any) => {
      const cleanEntity = log.entity_type ? log.entity_type.split('\\').pop() : 'Sistema';
      let finalAction = log.action;
      if (cleanEntity.includes("Sanction") || cleanEntity.includes("Sancion")) {
         finalAction = "SANCTION";
      }

      return {
        id: log.id,
        userName: log.user ? `${log.user.name} ${log.user.last_name || ''}` : 'Usuario Desconocido',
        action: finalAction,
        entityType: cleanEntity,
        entityId: log.entity_id,
        oldValues: log.old_values,
        newValues: log.new_values,
        ipAddress: log.ip_address,
        userAgent: log.user_agent,
        createdAt: log.created_at,
      }
    })
  } catch (error) {
    console.error("Error fetching logs:", error)
    return []
  }
}

export default async function AuditLogsPage() {
  await requireAdmin()
  const logs = await getAllAuditLogs()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-blue-950">Auditoría del Sistema</h1>
           <p className="mt-1 text-slate-600">Registro inmutable de acciones, accesos y sanciones.</p>
        </div>
      </div>

      {/* Renderizamos el componente cliente con las tarjetas y tablas */}
      <AuditLogsClient logs={logs} />
    </div>
  )
}