export const dynamic = 'force-dynamic'; // <--- AGREGÁ ESTO

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, AlertTriangle, TrendingDown } from "lucide-react"
import { getAuthToken } from "@/lib/auth"

// IMPORTAMOS TU MOTOR DE CÁLCULO
import { calculateRankings } from "@/lib/calculations" 

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

async function getRankingData() {
  const token = await getAuthToken()
  
  try {
    const res = await fetch(`${API_URL}/ranking`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      cache: "no-store" 
    })

    if (!res.ok) throw new Error("Error fetching data")

    const data = await res.json()

    // --- AQUÍ OCURRE LA MAGIA ---
    // Transformamos los datos de la BD (Snake_Case) al formato que espera tu función (CamelCase)
    
    const clubs = data.clubs.map((c: any) => ({
      id: c.id.toString(),
      name: c.name,
      code: c.code
    }))

    const events = data.events.map((e: any) => ({
      id: e.id.toString(),
      name: e.name,
      // Agrega otros campos si tu calculateRankings los necesita (ej: weight, maxScore)
    }))

    const scores = data.scores.map((s: any) => ({
      clubId: s.club_id.toString(),
      eventId: s.event_id.toString(),
      value: Number(s.score) // Asumiendo que tu BD tiene 'total_score' y tu función espera 'value'
    }))

    const sanctions = data.sanctions.map((s: any) => ({
      clubId: s.club_id.toString(),
      pointsDeducted: Number(s.points_deducted)
    }))

    return { clubs, events, scores, sanctions }

  } catch (error) {
    console.error("Error cargando datos para ranking:", error)
    return { clubs: [], events: [], scores: [], sanctions: [] }
  }
}

export default async function RankingsPage() {
  // 1. Traemos los datos crudos de la BD
  const { clubs, events, scores, sanctions } = await getRankingData()

  // 2. Usamos TU función de cálculo del Frontend
  const rankings = calculateRankings(clubs, events, scores, sanctions)

  // 3. Separamos podio y resto (Igual que antes)
  const top3 = rankings.slice(0, 3)
  const restOfClubs = rankings // O rankings.slice(3) si quieres ocultar el top 3 de la tabla

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-blue-950">
          Tabla de Posiciones Oficial
        </h1>
        <p className="text-xl text-muted-foreground">
          Resultados calculados en tiempo real (Frontend Engine)
        </p>
      </div>

      {/* --- PODIO (TOP 3) --- */}
      {top3.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3 mb-10 items-end">
          {top3.map((club, index) => (
            <Card 
              key={club.clubId} 
              className={`relative overflow-hidden border-t-8 shadow-xl transform transition-all hover:scale-105 ${
                index === 0 ? "border-t-yellow-400 bg-yellow-50/50 order-2 md:-mt-8 z-10 h-full" : 
                index === 1 ? "border-t-slate-300 order-1 h-[90%]" :                                 
                "border-t-amber-600 order-3 h-[85%]"                                                  
              }`}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-white p-3 rounded-full shadow-sm w-fit mb-2">
                  {index === 0 && <Trophy className="h-10 w-10 text-yellow-500" />}
                  {index === 1 && <Medal className="h-8 w-8 text-slate-400" />}
                  {index === 2 && <Medal className="h-8 w-8 text-amber-700" />}
                </div>
                <Badge variant="secondary" className="mx-auto w-fit mb-2">
                  Puesto #{club.rank}
                </Badge>
                <CardTitle className="text-2xl font-bold text-blue-900 line-clamp-1">{club.clubName}</CardTitle>
                <CardDescription className="font-mono text-xs">{club.clubCode}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-5xl font-black text-slate-800 tracking-tighter">
                  {club.finalScore.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-semibold">Puntos Totales</p>
                
                {club.sanctionDeductions > 0 && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                    <TrendingDown className="h-4 w-4" />
                    <span>-{club.sanctionDeductions} por sanciones</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* --- TABLA GENERAL --- */}
      <Card className="shadow-lg border-t-4 border-t-blue-600">
        <CardHeader>
          <CardTitle>Clasificación General</CardTitle>
          <CardDescription>Detalle completo de puntajes y penalizaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[80px] text-center font-bold">Rango</TableHead>
                <TableHead className="font-bold">Club</TableHead>
                <TableHead className="text-right font-bold text-green-700">Puntos Eventos</TableHead>
                <TableHead className="text-right font-bold text-red-600">Sanciones</TableHead>
                <TableHead className="text-right font-black text-lg">Puntaje Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restOfClubs.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                          Esperando datos...
                      </TableCell>
                  </TableRow>
              ) : (
                restOfClubs.map((club) => (
                    <TableRow key={club.clubId} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        club.rank <= 3 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {club.rank}
                        </span>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{club.clubName}</span>
                        <span className="text-xs text-muted-foreground">{club.clubCode}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-green-700">
                        +{club.eventScores.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-red-600">
                        {club.sanctionDeductions > 0 ? (
                        <span className="flex items-center justify-end gap-1 font-bold bg-red-50 px-2 py-1 rounded w-fit ml-auto">
                            -{club.sanctionDeductions}
                            <AlertTriangle className="h-3 w-3" />
                        </span>
                        ) : (
                        <span className="text-slate-300">-</span>
                        )}
                    </TableCell>
                    <TableCell className="text-right font-black text-lg text-blue-950">
                        {club.finalScore.toFixed(2)}
                    </TableCell>
                    </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}