import { requireAdmin } from "@/lib/auth"
import { mockClubs, mockEvents, mockScores, mockSanctions } from "@/lib/mock-data"
import { getClubDetailedStats } from "@/lib/calculations"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, AlertCircle } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClubScoresPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params

  const stats = getClubDetailedStats(id, mockClubs, mockEvents, mockScores, mockSanctions)
  if (!stats) notFound()

  return (
    <div className="container max-w-5xl py-6 space-y-6 animate-in fade-in">
      <div className="flex items-center gap-2">
        <Link href="/admin/clubs">
            <Button variant="ghost" size="sm"><ArrowLeft className="mr-1 h-4 w-4" /> Volver a Clubes</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Encabezado del Club */}
        <Card className="md:col-span-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-3xl font-bold">{stats.club.name}</h1>
              <p className="text-blue-200">Código: {stats.club.code}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-200 uppercase">Promedio General</p>
              <p className="text-4xl font-bold">{stats.averageScore.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de Sanciones */}
        <Card className="border-l-4 border-l-red-500">
           <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-500 font-medium">Puntos Perdidos (Sanciones)</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="text-2xl font-bold text-red-600 flex items-center gap-2">
                 -{stats.totalDeductions} pts
                 <AlertCircle className="h-5 w-5" />
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Tabla de Evaluaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Evaluaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Detalle</TableHead>
                <TableHead className="text-right">Nota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.eventBreakdown.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.eventName}</TableCell>
                  <TableCell>
                    <Badge variant={item.evaluationType === 'inspection' ? 'secondary' : 'outline'}>
                        {item.evaluationType === 'inspection' ? 'Inspección' : 'Regular'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                     {item.evaluationType === 'inspection' && item.details ? (
                         <span className="text-xs">
                             {Object.entries(item.details).filter(([_, v]) => Number(v) < 10).map(([k, v]) => (
                                 <span key={k} className="mr-2 text-red-600 font-bold">• {k}: {v}/10</span>
                             ))}
                             {Object.values(item.details).every(v => Number(v) === 10) && <span className="text-green-600 font-bold">¡Puntaje Perfecto!</span>}
                         </span>
                     ) : (
                        <span>Subjetivo (Creatividad/Ejecución)</span>
                     )}
                     {item.notes && <div className="italic text-xs mt-1">"{item.notes}"</div>}
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg">{item.score}</TableCell>
                </TableRow>
              ))}
              {stats.eventBreakdown.length === 0 && (
                <TableRow>
                   <TableCell colSpan={4} className="text-center py-8 text-slate-500">Sin evaluaciones registradas.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}