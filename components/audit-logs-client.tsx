"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Clock, User, ShieldAlert, Monitor, Globe, Download, ChevronLeft, ChevronRight, Filter, X } from "lucide-react"

// Función auxiliar para mantener tus colores originales
function getActionColor(action: string) {
  switch (action) {
    case "CREATE": return "text-green-600 border-green-200 bg-green-50"
    case "UPDATE": return "text-blue-600 border-blue-200 bg-blue-50"
    case "DELETE": return "text-red-600 border-red-200 bg-red-50"
    case "SANCTION": return "text-orange-600 border-orange-200 bg-orange-50"
    default: return "text-slate-600 border-slate-200 bg-slate-50"
  }
}

export function AuditLogsClient({ logs }: { logs: any[] }) {
  // --- ESTADOS ---
  const [filterAction, setFilterAction] = useState("ALL")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // --- LÓGICA DE FILTRADO ---
  const filteredLogs = logs.filter((log) => {
    return filterAction === "ALL" || log.action === filterAction
  })

  // --- LÓGICA DE PAGINACIÓN ---
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage)

  // --- ESTADÍSTICAS EN TIEMPO REAL (Basadas en los datos cargados) ---
  const stats = {
    total: logs.length,
    creates: logs.filter(l => l.action === "CREATE").length,
    sanctions: logs.filter(l => l.action === "SANCTION").length
  }

  // --- HANDLERS ---
  const handleFilterChange = (val: string) => {
    setFilterAction(val)
    setCurrentPage(1) // Volver a la página 1 al filtrar
  }

  const handleExport = () => {
    if (filteredLogs.length === 0) return
    const headers = ["ID", "Fecha", "Usuario", "Acción", "Entidad", "ID Entidad", "IP", "Cambios"]
    const rows = filteredLogs.map(log => [
        log.id,
        new Date(log.createdAt).toLocaleString().replace(/,/g, " "),
        log.userName,
        log.action,
        log.entityType,
        log.entityId,
        log.ipAddress || "-",
        `"${JSON.stringify(log.newValues || {}).replace(/"/g, "'")}"`
    ])
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "auditoria.csv") // Aquí descargas el archivo
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      
      {/* --- TUS CONTROLES ORIGINALES (Sin Buscador) --- */}
      <div className="flex flex-col md:flex-row justify-end gap-3">
        <div className="flex items-center gap-2">
            <Select value={filterAction} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[200px] bg-white">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-500" />
                    <SelectValue placeholder="Filtrar por Acción" />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">Todas las acciones</SelectItem>
                <SelectItem value="CREATE">Creaciones</SelectItem>
                <SelectItem value="UPDATE">Ediciones</SelectItem>
                <SelectItem value="DELETE">Eliminaciones</SelectItem>
                <SelectItem value="SANCTION">Sanciones</SelectItem>
            </SelectContent>
            </Select>

            {/* Botón limpiar filtro */}
            {filterAction !== "ALL" && (
                <Button variant="ghost" size="icon" onClick={() => handleFilterChange("ALL")}>
                    <X className="h-4 w-4 text-slate-500" />
                </Button>
            )}
        </div>

        <Button variant="outline" className="border-green-600 text-green-700 bg-green-50 hover:bg-green-100" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      {/* --- TUS TARJETAS ORIGINALES --- */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Tarjeta 1: Total */}
        <Card className="border-l-4 border-l-slate-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Registros Recientes</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <p className="mt-1 text-xs text-slate-500">Eventos cargados</p>
          </CardContent>
        </Card>

        {/* Tarjeta 2: Altas */}
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

        {/* Tarjeta 3: Sanciones */}
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

      {/* --- LISTA DETALLADA (Tu diseño anterior) --- */}
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50 border-b flex flex-row justify-between items-center py-3">
          <CardTitle className="text-lg text-slate-800">Detalle de Operaciones</CardTitle>
          <span className="text-xs text-slate-500 font-medium">
             Viendo {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLogs.length)} de {filteredLogs.length}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {paginatedLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <FileText className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                <p>No se encontraron registros con este filtro.</p>
              </div>
            ) : (
              paginatedLogs.map((log) => (
                <div key={log.id} className="flex flex-col md:flex-row items-start gap-4 p-6 hover:bg-slate-50/50 transition-colors">
                    {/* Icono */}
                    <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${getActionColor(log.action)} bg-opacity-20`}>
                      {log.action === 'SANCTION' ? <ShieldAlert className="h-5 w-5"/> : <FileText className="h-5 w-5" />}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 space-y-2 w-full">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`${getActionColor(log.action)} font-bold`}>{log.action}</Badge>
                                <span className="font-semibold text-slate-900">{log.entityType}</span>
                                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1 rounded">#{log.entityId}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(log.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                             <div className="flex items-center gap-2"><User className="h-3 w-3 text-blue-500" /><span className="font-medium text-slate-900">{log.userName}</span></div>
                             <div className="flex items-center gap-2 truncate"><Monitor className="h-3 w-3 text-purple-500" /><span className="truncate text-xs">{log.userAgent || "N/A"}</span></div>
                             <div className="flex items-center gap-2"><Globe className="h-3 w-3 text-green-600" /><span className="font-mono text-xs">{log.ipAddress}</span></div>
                        </div>

                        {/* Detalles JSON */}
                        {(log.oldValues || log.newValues) && (
                            <details className="group">
                                <summary className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2 select-none w-fit">Ver Detalles Técnicos (JSON)</summary>
                                <div className="mt-2 grid md:grid-cols-2 gap-4 rounded-lg border bg-slate-900 p-3 text-xs text-slate-50 font-mono shadow-inner">
                                    {log.oldValues && Object.keys(log.oldValues).length > 0 && (
                                        <div><p className="font-bold text-red-300 mb-1">Valor Anterior:</p><pre className="overflow-x-auto whitespace-pre-wrap text-slate-300">{JSON.stringify(log.oldValues, null, 2)}</pre></div>
                                    )}
                                    {log.newValues && Object.keys(log.newValues).length > 0 && (
                                        <div><p className="font-bold text-green-300 mb-1">Nuevo Valor:</p><pre className="overflow-x-auto whitespace-pre-wrap text-slate-300">{JSON.stringify(log.newValues, null, 2)}</pre></div>
                                    )}
                                </div>
                            </details>
                        )}
                    </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* --- PAGINACIÓN INFERIOR --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2 pb-6">
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4 mr-2" /> Anterior
            </Button>
            <span className="text-sm font-medium text-slate-600">Página <span className="text-blue-700 font-bold">{currentPage}</span> de {totalPages}</span>
            <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                Siguiente <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
      )}
    </div>
  )
}