"use client"

import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
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
        `"${r.clubName}"`, 
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
    window.print()
  }

  return (
    <div className="flex gap-2 print:hidden">
      {/* Botón de Excel (Secundario / Verde) */}
      <Button variant="outline" onClick={handleExportCSV} className="border-green-200 hover:bg-green-50 text-green-700">
        <Download className="mr-2 h-4 w-4" />
        Exportar CSV
      </Button>

      {/* Botón Principal (Imprimir / PDF) */}
      <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
        <Printer className="mr-2 h-4 w-4" />
        Imprimir / PDF
      </Button>
    </div>
  )
}