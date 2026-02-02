import { requireAdmin } from "@/lib/auth"
import { getClubStats } from "@/lib/api" // <--- Importamos la API real
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertCircle, FileText } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClubScoresPage({ params }: PageProps) {
  // 1. Verificación de Admin
  await requireAdmin()

  // 2. Obtener el ID de la URL
  const { id } = await params

  // 3. Llamar a la API REAL (Backend)
  // Usamos catch para manejar el error si el club no existe
  const stats = await getClubStats(id).catch((e) => {
    console.error("Error cargando stats:", e)
    return null
  })

  // 4. Si la API devuelve null o no trae el club, mostramos 404
  if (!stats || !stats.club) {
    notFound()
  }

  return (
    <div className="container max-w-5xl py-6 space-y-6 animate-in fade-in">
      <div className="flex items-center gap-2">
        <Link href="/admin/clubs">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="mr-1 h-4 w-4" /> Volver a Clubes
            </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* TARJETA PRINCIPAL: DATOS DEL CLUB */}
        <Card className="md:col-span-3 bg-linear-to-r from-blue-900 to-blue-800 text-white shadow-lg border-none">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">{stats.club.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                 <Badge variant="secondary" className="bg-blue-700 hover:bg-blue-600 text-blue-100 border-none font-mono">
                    {stats.club.code}
                 </Badge>
                 <span className="text-sm text-blue-200">
                    {stats.club.is_active ? "• Compitiendo Activametne" : "• Inactivo"}
                 </span>
              </div>
            </div>
            
            <div className="text-left sm:text-right bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
              <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Promedio Actual</p>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-5xl font-extrabold text-white">{stats.averageScore}</span>
                <span className="text-lg text-blue-300">pts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TARJETA: SANCIONES (Placeholder funcional) */}
        <Card className="md:col-span-1 border-l-4 border-l-red-500 shadow-sm">
           <CardHeader className="pb-2">
              <CardTitle className="text-xs text-slate-500 font-bold uppercase tracking-wider">Puntos Perdidos</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="flex items-center gap-2">
                 <span className={`text-2xl font-bold ${stats.totalDeductions > 0 ? "text-red-600" : "text-slate-400"}`}>
                    -{stats.totalDeductions}
                 </span>
                 {stats.totalDeductions > 0 && <AlertCircle className="h-5 w-5 text-red-500" />}
              </div>
           </CardContent>
        </Card>
      </div>

      {/* TABLA DE EVALUACIONES REALES */}
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50 px-6 py-4">
          <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Historial de Evaluaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[30%] pl-6">Evento</TableHead>
                <TableHead>Detalle de Criterios</TableHead>
                <TableHead className="text-right pr-6">Nota Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.eventBreakdown && stats.eventBreakdown.length > 0 ? (
                stats.eventBreakdown.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="pl-6 align-top py-4">
                        <div className="font-bold text-slate-900 text-base">{item.eventName}</div>
                        <Badge variant="outline" className="mt-2 text-xs text-slate-500 font-normal">
                            {item.evaluationType || 'Estándar'}
                        </Badge>
                    </TableCell>
                    
                    <TableCell className="align-top py-4">
                       {/* Renderizado de detalles JSON */}
                       {item.details ? (
                           <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                               {Object.entries(item.details).map(([k, v]) => (
                                   <div key={k} className="flex flex-col border-l-2 border-slate-100 pl-2">
                                       <span className="capitalize text-xs text-slate-400 font-medium mb-0.5">{k}</span>
                                       <span className="font-bold text-slate-700">{String(v)}</span>
                                   </div>
                               ))}
                           </div>
                       ) : (
                          <span className="text-slate-400 italic text-sm">Sin desglose disponible</span>
                       )}
                       
                       {/* Feedback del juez */}
                       {item.notes && (
                           <div className="mt-3 bg-yellow-50/80 p-3 rounded-md text-sm text-yellow-800 border border-yellow-100 flex gap-2">
                               <span className="font-bold shrink-0">Comentario:</span> 
                               <span className="italic">"{item.notes}"</span>
                           </div>
                       )}
                    </TableCell>

                    <TableCell className="text-right pr-6 align-top py-4">
                        <span className="inline-flex items-center justify-center min-w-[3rem] h-10 text-xl font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
                            {item.score}
                        </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                   <TableCell colSpan={3} className="text-center py-16 text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-slate-100 p-4 rounded-full">
                            <AlertCircle className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="font-medium">No hay evaluaciones registradas para este club todavía.</p>
                        <p className="text-sm">Asigna jueces a los eventos para comenzar a calificar.</p>
                      </div>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}