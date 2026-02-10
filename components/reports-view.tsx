"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button" // <--- Necesario
import { BarChart3, TrendingUp, AlertCircle, Trophy, Medal, Download, Printer } from "lucide-react"

// Interfaz que viene del Backend
interface RankingItem {
  id: number
  name: string
  code: string
  events_score: number
  sanctions_penalty: number
  total_score: number
}

interface ReportsViewProps {
  ranking: RankingItem[]
}

export function ReportsView({ ranking }: ReportsViewProps) {
  
  // Helper para formatear números
  const safeFormat = (value: any) => {
    const num = Number(value)
    return isNaN(num) ? "0.00" : num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // --- LÓGICA DE EXPORTACIÓN CSV ---
  const handleExportCSV = () => {
    if (!ranking || ranking.length === 0) return

    const headers = ["Posición", "Club", "Código", "Puntos Eventos", "Descuentos", "Total Final"]
    
    const rows = ranking.map((item, index) => [
        index + 1,
        `"${item.name}"`, // Comillas para evitar problemas con comas en el nombre
        item.code || "-",
        item.events_score.toFixed(2),
        item.sanctions_penalty.toFixed(2),
        item.total_score.toFixed(2)
    ])

    const csvContent = [
        headers.join(","), 
        ...rows.map(r => r.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `ranking_oficial_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // --- LÓGICA DE IMPRESIÓN (PDF) ---
  const handlePrint = () => {
    window.print()
  }

  // --- ESTADÍSTICAS ---
  const totalClubs = ranking.length
  const averageScore = totalClubs > 0 
    ? (ranking.reduce((acc, curr) => acc + Number(curr.total_score), 0) / totalClubs).toFixed(2)
    : "0.00"
  const mostSanctionedClub = [...ranking].sort((a, b) => b.sanctions_penalty - a.sanctions_penalty)[0]
  const leaderClub = ranking.length > 0 ? ranking[0] : null

  // Renderizado de medallas
  const renderRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500 fill-yellow-100" />
    if (index === 1) return <Medal className="h-5 w-5 text-slate-400 fill-slate-100" />
    if (index === 2) return <Medal className="h-5 w-5 text-amber-700 fill-amber-100" />
    return <span className="font-bold text-slate-500">#{index + 1}</span>
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- ENCABEZADO CON BOTONES --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-blue-950">Reportes y Ranking</h2>
          <p className="text-muted-foreground">
            Tabla oficial de posiciones calculada con pesos y sanciones.
          </p>
        </div>
        
        {/* BOTONERA DE EXPORTACIÓN (Oculta al imprimir) */}
        <div className="flex gap-2 print:hidden">
            <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir / PDF
            </Button>
            <Button variant="outline" className="border-green-600 text-green-700 bg-green-50 hover:bg-green-100" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
            </Button>
        </div>
      </div>

      {/* --- TARJETAS DE ESTADÍSTICAS --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 print:gap-2">
        <Card className="border-l-4 border-l-yellow-400 shadow-sm print:border print:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Líder Actual</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 truncate">
                {leaderClub ? leaderClub.name : "Sin datos"}
            </div>
            <p className="text-xs text-muted-foreground">
                {leaderClub ? `${safeFormat(leaderClub.total_score)} pts` : "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm print:border print:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Promedio Global</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{averageScore}</div>
            <p className="text-xs text-muted-foreground">Puntaje medio</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm print:border print:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Clubes</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalClubs}</div>
            <p className="text-xs text-muted-foreground">Compitiendo</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-sm print:border print:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Sanciones</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
               {mostSanctionedClub && mostSanctionedClub.sanctions_penalty > 0 
                  ? `-${mostSanctionedClub.sanctions_penalty}` 
                  : "0"}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {mostSanctionedClub && mostSanctionedClub.sanctions_penalty > 0 
                ? `${mostSanctionedClub.name}` 
                : "Sin sanciones"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- TABLA PRINCIPAL --- */}
      <Card className="col-span-4 border-t-4 border-t-blue-800 shadow-md print:shadow-none print:border-t-0 print:border">
        <CardHeader className="print:pb-2">
          <CardTitle>Tabla General de Posiciones</CardTitle>
          <CardDescription className="print:hidden">
            Resultados calculados en base a pesos de eventos y deducciones aplicadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 print:bg-slate-200">
                <TableHead className="w-[80px] font-bold text-center">Pos.</TableHead>
                <TableHead className="font-bold">Club</TableHead>
                <TableHead className="text-right font-bold text-green-700 hidden md:table-cell print:table-cell">Puntaje Eventos</TableHead>
                <TableHead className="text-right font-bold text-red-600">Descuentos</TableHead>
                <TableHead className="text-right font-black text-blue-900 text-lg bg-slate-100/50 print:bg-transparent">Total Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        <Trophy className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                        No hay datos disponibles para generar el ranking.
                      </TableCell>
                  </TableRow>
              ) : (
                ranking.map((club, index) => (
                    <TableRow key={club.id} className={`hover:bg-slate-50 transition-colors ${index < 3 ? 'bg-blue-50/10 print:bg-slate-50' : ''}`}>
                    
                    {/* POSICIÓN */}
                    <TableCell className="font-medium text-center">
                        <div className="flex justify-center items-center">
                            {renderRankIcon(index)}
                        </div>
                    </TableCell>
                    
                    {/* NOMBRE DEL CLUB */}
                    <TableCell>
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-800 text-lg">{club.name}</span>
                            <span className="text-xs text-slate-500 font-mono">{club.code || "S/C"}</span>
                        </div>
                    </TableCell>
                    
                    {/* PUNTAJE EVENTOS (Hidden en móvil, Visible al imprimir) */}
                    <TableCell className="text-right text-green-700 font-mono hidden md:table-cell print:table-cell">
                        {safeFormat(club.events_score)}
                    </TableCell>
                    
                    {/* SANCIONES */}
                    <TableCell className="text-right">
                         {Number(club.sanctions_penalty) > 0 ? (
                            <Badge variant="destructive" className="font-mono print:border-red-500 print:text-red-600 print:bg-transparent">
                                -{Number(club.sanctions_penalty)}
                            </Badge>
                         ) : (
                            <span className="text-slate-300">-</span>
                         )}
                    </TableCell>
                    
                    {/* TOTAL FINAL */}
                    <TableCell className="text-right font-black text-xl text-blue-950 bg-slate-100/30 print:bg-transparent">
                        {safeFormat(club.total_score)}
                    </TableCell>
                    </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Footer para impresión */}
      <div className="hidden print:block text-center text-xs text-slate-400 mt-8">
        Reporte generado el {new Date().toLocaleDateString()} - Sistema de Gestión de Camporee
      </div>
    </div>
  )
}