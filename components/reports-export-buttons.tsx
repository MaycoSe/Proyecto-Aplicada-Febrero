"use client"

import { Button } from "@/components/ui/button"
import { Download, FileText, Printer } from "lucide-react"
import type { ClubRanking } from "@/lib/types"

export function ReportsExportButtons({ rankings }: { rankings: ClubRanking[] }) {

  const handleExportCSV = () => {
    if (rankings.length === 0) {
        alert("No hay datos para exportar.")
        return
    }

    // 1. Definir encabezados
    const headers = ["Posición", "Club", "Puntaje Eventos", "Descuentos (Sanciones)", "Puntaje Final"]
    
    // 2. Mapear datos
    const rows = rankings.map(r => [
        r.rank,
        `"${r.clubName}"`, // Comillas para evitar problemas con comas en nombres
        r.eventScores.toFixed(2),
        r.sanctionDeductions.toFixed(2),
        r.finalScore.toFixed(2)
    ])

    // 3. Crear contenido CSV
    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
    ].join("\n")

    // 4. Descargar
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `ranking_camporee_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    // Abre el diálogo de impresión del navegador
    // (CSS de impresión ya debería ocultar botones innecesarios si está bien configurado, 
    // pero window.print() es la forma estándar de "Guardar como PDF")
    window.print()
  }

  return (
    <div className="flex gap-2 print:hidden">
      <Button variant="outline" onClick={handlePrint} className="border-blue-200 hover:bg-blue-50 text-blue-700">
        <FileText className="mr-2 h-4 w-4" />
        PDF Global
      </Button>
      <Button variant="outline" onClick={handleExportCSV} className="border-green-200 hover:bg-green-50 text-green-700">
        <Download className="mr-2 h-4 w-4" />
        Excel / CSV
      </Button>
      <Button onClick={handlePrint} className="bg-slate-800 hover:bg-slate-900">
        <Printer className="mr-2 h-4 w-4" />
        Imprimir
      </Button>
    </div>
  )
}