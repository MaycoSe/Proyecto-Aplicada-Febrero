import { requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAuditLogs, getActionColor } from "@/lib/audit"
import { mockUsers } from "@/lib/mock-data"
import { AuditControls } from "@/components/audit-controls" // <--- IMPORTAMOS EL COMPONENTE NUEVO
import { FileText, Clock, User, ShieldAlert, Monitor, Globe } from "lucide-react"

// Definimos que la página puede recibir parámetros de búsqueda (Query Params)
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AuditLogsPage({ searchParams }: PageProps) {
  await requireAdmin()
  
  // 1. Leemos los filtros de la URL
  const params = await searchParams
  const actionFilter = typeof params.action === 'string' ? params.action : undefined

  // 2. Pedimos los logs FILTRADOS
  const auditLogs = await getAuditLogs({
      action: actionFilter // Si es undefined, trae todo. Si tiene valor, filtra.
  })

  // Estadísticas rápidas (Calculadas sobre lo que se ve)
  const stats = {
    totalLogs: auditLogs.length,
    creates: auditLogs.filter((log) => log.action === "CREATE").length,
    updates: auditLogs.filter((log) => log.action === "UPDATE").length,
    sanctions: auditLogs.filter((log) => log.action === "SANCTION").length,
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Auditoría del Sistema</h1>
          <p className="mt-1 text-slate-600">Registro inmutable de todas las acciones, accesos y sanciones.</p>
        </div>
        
        {/* 3. Insertamos el componente de controles aquí */}
        <AuditControls logs={auditLogs} />
        
      </div>

      {/* --- TARJETAS DE RESUMEN --- */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-slate-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Registros Visibles</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.totalLogs}</div>
            <p className="mt-1 text-xs text-slate-500">Eventos en esta vista</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Altas / Creaciones</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.creates}</div>
            <p className="mt-1 text-xs text-slate-500">Nuevos registros</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
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
              auditLogs.map((log) => {
                const user = mockUsers.find((u) => u.id === log.userId)
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
                            #{log.entityId ? log.entityId.slice(-6) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-blue-500" />
                          <span className="font-medium text-slate-900">{user?.fullName || "Sistema / Desconocido"}</span>
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
                            {log.oldValues && (
                              <div>
                                <p className="font-bold text-red-300 mb-1">Valor Anterior:</p>
                                <pre className="overflow-x-auto whitespace-pre-wrap">
                                  {JSON.stringify(log.oldValues, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.newValues && (
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