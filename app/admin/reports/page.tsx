"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, AlertCircle, Eye, Trophy } from "lucide-react"
import { calculateRankings, getClubDetailedStats } from "@/lib/calculations"
import { mockClubs, mockEvents, mockScores, mockSanctions } from "@/lib/mock-data"
import { ReportsExportButtons } from "@/components/reports-export-buttons" // <--- IMPORTAMOS EL NUEVO COMPONENTE

export default function ReportsPage() {
  const [selectedClubId, setSelectedClubId] = useState<string>("")
  
  // Calculamos los datos en tiempo real
  const rankings = calculateRankings(mockClubs, mockEvents, mockScores, mockSanctions)
  const detailedStats = selectedClubId 
    ? getClubDetailedStats(selectedClubId, mockClubs, mockEvents, mockScores, mockSanctions) 
    : null

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* --- ENCABEZADO SUPERIOR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-blue-950">Reportes y Estadísticas</h2>
          <p className="text-muted-foreground">
            Auditoría de rendimiento, desglose de puntajes y control disciplinario.
          </p>
        </div>
        
        {/* COMPONENTE DE BOTONES FUNCIONALES */}
        <ReportsExportButtons rankings={rankings} />
        
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-100 p-1 print:hidden">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
            Visión Global
          </TabsTrigger>
          <TabsTrigger value="club-detail" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm">
            Detalle por Club
          </TabsTrigger>
        </TabsList>

        {/* --- PESTAÑA 1: VISIÓN GLOBAL --- */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 print:grid-cols-4">
            
            {/* Tarjeta 1: Líder */}
            <Card className="border-l-4 border-l-yellow-400 shadow-sm print:border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Club Líder Actual</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 truncate">
                    {rankings[0]?.clubName || "Sin datos"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {rankings[0] ? `${rankings[0].finalScore.toFixed(2)} puntos totales` : "Esperando puntajes"}
                </p>
              </CardContent>
            </Card>

            {/* Tarjeta 2: Evaluaciones */}
            <Card className="border-l-4 border-l-blue-500 shadow-sm print:border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Evaluaciones</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{mockScores.length}</div>
                <p className="text-xs text-muted-foreground">
                  Registros procesados por jueces
                </p>
              </CardContent>
            </Card>

            {/* Tarjeta 3: Sanciones */}
            <Card className="border-l-4 border-l-red-500 shadow-sm print:border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Sanciones Activas</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">{mockSanctions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Infracciones descontando puntos
                </p>
              </CardContent>
            </Card>

             {/* Tarjeta 4: Promedio */}
             <Card className="border-l-4 border-l-green-500 shadow-sm print:border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Promedio General</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                    {rankings.length > 0 
                        ? (rankings.reduce((acc, curr) => acc + curr.finalScore, 0) / rankings.length).toFixed(1) 
                        : "0.0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Puntos promedio por club
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4 border-t-4 border-t-blue-800 shadow-md print:shadow-none print:border">
            <CardHeader>
              <CardTitle>Resumen Oficial de Posiciones</CardTitle>
              <CardDescription>
                Tabla simplificada para revisión rápida de directores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 print:bg-slate-200">
                    <TableHead className="w-[80px] font-bold text-center">Pos.</TableHead>
                    <TableHead className="font-bold">Club</TableHead>
                    <TableHead className="text-right font-bold text-green-700">Puntaje Eventos</TableHead>
                    <TableHead className="text-right font-bold text-red-600">Descuentos</TableHead>
                    <TableHead className="text-right font-black text-blue-900">Total Final</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankings.map((club) => (
                    <TableRow key={club.clubId} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            club.rank <= 3 ? 'bg-yellow-100 text-yellow-800 print:bg-slate-100' : 'bg-slate-100 text-slate-500'
                        }`}>
                            {club.rank}º
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-slate-700">{club.clubName}</TableCell>
                      <TableCell className="text-right text-green-700 font-mono">+{club.eventScores.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-red-600 font-mono font-semibold">
                        {club.sanctionDeductions > 0 ? `-${club.sanctionDeductions}` : <span className="text-slate-300">-</span>}
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg text-blue-950">{club.finalScore.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- PESTAÑA 2: DETALLE POR CLUB --- */}
        <TabsContent value="club-detail" className="space-y-4">
          <Card className="border shadow-md print:shadow-none">
            <CardHeader className="bg-slate-50/50 border-b pb-6 print:bg-white">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <CardTitle className="text-xl text-blue-900">Boletín Individual de Club</CardTitle>
                    <CardDescription className="print:hidden">
                        Seleccione un club para auditar sus notas, inspecciones y observaciones.
                    </CardDescription>
                </div>
                <div className="w-full md:w-[300px] print:hidden">
                    <Select value={selectedClubId} onValueChange={setSelectedClubId}>
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="🔍 Buscar club..." />
                    </SelectTrigger>
                    <SelectContent>
                        {mockClubs.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
              </div>
            </CardHeader>
            
            {detailedStats ? (
                <CardContent className="space-y-6 pt-6">
                    {/* ENCABEZADO DEL CLUB SELECCIONADO */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border rounded-lg p-4 bg-slate-50 print:bg-white print:border-slate-300">
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Club</p>
                            <h3 className="text-2xl font-bold text-blue-900">{detailedStats.club.name}</h3>
                            <p className="text-sm text-slate-500">{detailedStats.club.code}</p>
                        </div>
                        <div className="md:text-center md:border-l md:border-r print:border-none">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Evaluaciones</p>
                            <p className="text-2xl font-bold text-slate-700">{detailedStats.totalEvents}</p>
                            <p className="text-xs text-slate-500">Eventos registrados</p>
                        </div>
                        <div className="md:text-right">
                             <p className="text-xs font-semibold text-muted-foreground uppercase">Descuentos Totales</p>
                             <p className={`text-2xl font-bold ${detailedStats.totalDeductions > 0 ? 'text-red-600' : 'text-slate-300'}`}>
                                -{detailedStats.totalDeductions}
                             </p>
                             <p className="text-xs text-slate-500">Puntos de sanción</p>
                        </div>
                    </div>

                    {/* TABLA DE DETALLES */}
                    <div>
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-600" /> Historial de Evaluaciones
                        </h4>
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-100 print:bg-slate-200">
                                    <TableRow>
                                        <TableHead className="font-bold text-slate-700">Evento</TableHead>
                                        <TableHead className="font-bold text-slate-700">Tipo</TableHead>
                                        <TableHead className="font-bold text-slate-700 w-[50%]">Detalles y Observaciones</TableHead>
                                        <TableHead className="text-right font-bold text-slate-700">Nota</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {detailedStats.eventBreakdown.map((item, idx) => (
                                        <TableRow key={idx} className="hover:bg-slate-50">
                                            <TableCell className="font-medium text-blue-900">{item.eventName}</TableCell>
                                            <TableCell>
                                                <Badge variant={item.evaluationType === 'inspection' ? 'secondary' : 'outline'} className="capitalize font-normal print:border-slate-400">
                                                    {item.evaluationType === 'inspection' ? 'Inspección' : 'Regular'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {/* Lógica de visualización según tipo */}
                                                {item.evaluationType === 'inspection' && item.details ? (
                                                    <div className="space-y-1">
                                                        <div className="text-xs font-semibold text-slate-500 mb-1">Ítems Evaluados:</div>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                                            {Object.entries(item.details).map(([k, v]) => (
                                                                <div key={k} className={`flex justify-between border px-2 py-1 rounded ${Number(v) < 10 ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}>
                                                                    <span className="truncate mr-2">{k}</span>
                                                                    <span className={`font-bold ${Number(v) < 10 ? "text-red-600" : "text-green-700"}`}>{v}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-4 text-xs text-slate-600">
                                                        <span className="bg-slate-100 px-2 py-1 rounded">Creatividad: <b>{item.creativityScore}</b></span>
                                                        <span className="bg-slate-100 px-2 py-1 rounded">Ejecución: <b>{item.executionScore}</b></span>
                                                        {item.presentationScore !== undefined && (
                                                            <span className="bg-slate-100 px-2 py-1 rounded">Presentación: <b>{item.presentationScore}</b></span>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Notas del juez */}
                                                {item.notes && (
                                                    <div className="mt-2 text-xs italic text-slate-500 bg-yellow-50/50 p-2 rounded border border-yellow-100 print:bg-transparent print:border-none">
                                                        <span className="font-semibold text-yellow-700 print:text-slate-800">Juez:</span> "{item.notes}"
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-lg text-slate-800">
                                                {item.score.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {detailedStats.eventBreakdown.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                                No hay evaluaciones registradas para este club.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            ) : (
                <CardContent className="py-16 text-center text-muted-foreground bg-slate-50/30 print:hidden">
                    <Trophy className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                    <p className="text-lg font-medium text-slate-600">Ningún club seleccionado</p>
                    <p>Utilice el buscador superior para ver el reporte detallado.</p>
                </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}