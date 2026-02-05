import { requireAdmin, getAuthToken } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuditControls } from "@/components/audit-controls" 
import { FileText, Clock, User, ShieldAlert, Monitor, Globe } from "lucide-react"

// URL de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Función auxiliar para obtener el color según la acción
function getActionColor(action: string) {
  switch (action) {
    case "CREATE": return "text-green-600 border-green-200 bg-green-50"
    case "UPDATE": return "text-blue-600 border-blue-200 bg-blue-50"
    case "DELETE": return "text-red-600 border-red-200 bg-red-50"
    case "SANCTION": return "text-orange-600 border-orange-200 bg-orange-50"
    default: return "text-slate-600 border-slate-200 bg-slate-50"
  }
}

// Función para traer logs REALES
async function getRealAuditLogs(filterAction?: string) {
  const token = await getAuthToken()
  
  // Construimos la URL con filtros
  let url = `${API_URL}/audit-logs`
  if (filterAction && filterAction !== "ALL") {
    url += `?action=${filterAction}`
  }

  try {
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) return []

    const data = await res.json()

    // MAPEO: Convertimos Snake_case (Laravel) a CamelCase (Frontend)
    return data.map((log: any) => ({
      id: log.id,
      userId: log.user_id,
      // Si el backend mandó el usuario, usamos su nombre. Si no, "Usuario Eliminado"
      userName: log.user ? `${log.user.name} ${log.user.last_name || ''}` : 'Usuario Desconocido',
      action: log.action,
      entityType: log.entity_type,
      entityId: log.entity_id,
      oldValues: log.old_values, // Laravel ya lo manda como objeto gracias a $casts
      newValues: log.new_values,
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      createdAt: log.created_at,
    }))

  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return []
  }
}

export default async function AuditLogsPage({ searchParams }: PageProps) {
  await requireAdmin()
  
  const params = await searchParams
  const actionFilter = typeof params.action === 'string' ? params.action : undefined

  // 1. Pedimos los logs REALES
  const auditLogs = await getRealAuditLogs(actionFilter)

  // Estadísticas rápidas (Sobre los datos traídos)
  const stats = {
    totalLogs: auditLogs.length,
    creates: auditLogs.filter((log: any) => log.action === "CREATE").length,
    updates: auditLogs.filter((log: any) => log.action === "UPDATE").length,
    sanctions: auditLogs.filter((log: any) => log.action === "SANCTION").length,
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Auditoría del Sistema</h1>
          <p className="mt-1 text-slate-600">Registro inmutable de todas las acciones, accesos y sanciones.</p>
        </div>
        
        {/* Pasamos los logs para que el control (si tiene exportar CSV) funcione */}
        <AuditControls logs={auditLogs} />
      </div>

      {/* --- TARJETAS DE RESUMEN --- */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-slate-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Registros Recientes</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalLogs}</div>
            <p className="mt-1 text-xs text-slate-500">Mostrando últimos 100 eventos</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Altas / Creaciones</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.creates}</div>
            <p className="mt-1 text-xs text-slate-500">Nuevos registros</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Sanciones</CardTitle>
            <ShieldAlert className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.sanctions}</div>
            <p className="mt-1 text-xs text-slate-500">Acciones disciplinarias</p>
          </CardContent>
        </Card>
      </div>

      {/* --- LISTADO DE LOGS --- */}
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-lg text-slate-800">Detalle de Operaciones</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {auditLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <FileText className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4">No se encontraron registros con los filtros actuales.</p>
              </div>
            ) : (
              auditLogs.map((log: any) => {
                // YA NO NECESITAMOS mockUsers.find(), el nombre viene en log.userName
                return (
                  <div key={log.id} className="flex flex-col md:flex-row items-start gap-4 p-6 hover:bg-slate-50/50 transition-colors">
                    
                    <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${getActionColor(log.action)} bg-opacity-20`}>
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${getActionColor(log.action)} font-bold`}>
                            {log.action}
                          </Badge>
                          <span className="font-semibold text-slate-900">
                             {log.entityType} 
                          </span>
                          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1 rounded">
                            #{log.entityId ? log.entityId.toString().slice(-6) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Clock className="h-3 w-3" />
                          {/* Formateamos la fecha correctamente */}
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-blue-500" />
                          {/* Usamos el nombre que trajimos del backend */}
                          <span className="font-medium text-slate-900">{log.userName}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate" title={log.userAgent}>
                          <Monitor className="h-3 w-3 text-purple-500" />
                          <span className="truncate text-xs">{log.userAgent || "Dispositivo Desconocido"}</span>
                        </div>
                          <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3 text-green-600" />
                          <span className="font-mono text-xs">{log.ipAddress || "127.0.0.1"}</span>
                        </div>
                      </div>

                      {(log.oldValues || log.newValues) && (
                        <details className="group">
                          <summary className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2 select-none">
                            Ver Detalles Técnicos (JSON)
                          </summary>
                          <div className="mt-2 grid md:grid-cols-2 gap-4 rounded-lg border bg-slate-900 p-3 text-xs text-slate-50 font-mono shadow-inner">
                            {/* Verificamos que no sea array vacío o null */}
                            {log.oldValues && Object.keys(log.oldValues).length > 0 && (
                              <div>
                                <p className="font-bold text-red-300 mb-1">Valor Anterior:</p>
                                <pre className="overflow-x-auto whitespace-pre-wrap">
                                  {JSON.stringify(log.oldValues, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.newValues && Object.keys(log.newValues).length > 0 && (
                              <div>
                                <p className="font-bold text-green-300 mb-1">Nuevo Valor:</p>
                                <pre className="overflow-x-auto whitespace-pre-wrap">
                                  {JSON.stringify(log.newValues, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}