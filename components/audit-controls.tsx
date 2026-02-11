"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter, X } from "lucide-react"
import type { AuditLog } from "@/lib/types"

export function AuditControls({ logs }: { logs: AuditLog[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Leemos el filtro actual de la URL (si existe)
  const currentAction = searchParams.get("action") || "all"

  // Lógica de Filtrado: Actualiza la URL
  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set("action", value)
    } else {
      params.delete("action")
    }
    router.push(`/admin/audit?${params.toString()}`)
  }

  // Lógica de Exportación a CSV
  const handleExport = () => {
    if (logs.length === 0) {
        alert("No hay datos para exportar.")
        return
    }

    // 1. Definir columnas
    const headers = ["ID", "Fecha", "Usuario", "Acción", "Entidad", "ID Entidad", "IP", "Cambios"]
    
    // 2. Mapear datos
    const rows = logs.map(log => [
        log.id,
        new Date(log.createdAt).toLocaleString().replace(/,/g, " "), // Quitar comas de la fecha para no romper CSV
        log.userId || "Sistema",
        log.action,
        log.entityType,
        log.entityId,
        log.ipAddress || "-",
        `"${JSON.stringify(log.newValues || {}).replace(/"/g, "'")}"` // Escapar JSON
    ])

    // 3. Unir todo
    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
    ].join("\n")

    // 4. Crear archivo virtual y descargarlo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `auditoria_camporee_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex gap-2">
       {/* SELECTOR DE FILTRO */}
       <Select value={currentAction} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px] bg-white border-slate-300">
            <Filter className="mr-2 h-4 w-4 text-slate-500" />
            <SelectValue placeholder="Filtrar por Acción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Acciones</SelectItem>
            <SelectItem value="CREATE">Creaciones (Altas)</SelectItem>
            <SelectItem value="UPDATE">Ediciones (Cambios)</SelectItem>
            <SelectItem value="DELETE">Eliminaciones (Bajas)</SelectItem>
            <SelectItem value="SANCTION">Sanciones</SelectItem>
            <SelectItem value="LOGIN">Accesos</SelectItem>
          </SelectContent>
       </Select>

       {/* BOTÓN PARA LIMPIAR FILTRO (Solo aparece si hay filtro activo) */}
       {currentAction !== "all" && (
           <Button variant="ghost" size="icon" onClick={() => handleFilterChange("all")} title="Limpiar filtro">
               <X className="h-4 w-4" />
           </Button>
       )}

       {/* BOTÓN EXPORTAR */}
       <Button variant="outline" className="border-green-600 text-green-700 bg-green-50 hover:bg-green-100" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Exportar CSV
      </Button>
    </div>
  )
}