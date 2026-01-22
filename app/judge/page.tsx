import { requireJudge } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockEvents } from "@/lib/mock-data"
import { Calendar, PenTool, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default async function JudgeDashboard() {
  const user = await requireJudge()

  // FILTRO INTELIGENTE:
  // Mostramos el evento SI:
  // 1. Está activo (isActive)
  // 2. Y ADEMÁS:
  //    a) No tiene lista de jueces asignados (es abierto para todos)
  //    b) O el usuario está en la lista de 'assignedJudges'
  const activeEvents = mockEvents.filter(e => 
    e.isActive && 
    (!e.assignedJudges || e.assignedJudges.length === 0 || e.assignedJudges.includes(user.id))
  )

  return (
    <div className="container max-w-4xl py-6 space-y-8 animate-in fade-in duration-500">
      <div className="bg-blue-900 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">¡Hola, {user.fullName}!</h1>
        <p className="text-blue-100 mt-1">
          Bienvenido. Tienes <span className="font-bold text-yellow-300">{activeEvents.length}</span> eventos disponibles para evaluar hoy.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" /> Eventos Asignados
        </h2>
        
        {activeEvents.length === 0 ? (
           <div className="text-center py-12 border-2 border-dashed rounded-xl bg-slate-50">
              <p className="text-slate-500">No tienes eventos asignados en este momento.</p>
           </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {activeEvents.map((event) => (
              <Card key={event.id} className="group hover:border-blue-400 transition-all shadow-sm hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant={event.evaluationType === 'inspection' ? 'secondary' : 'default'} className="mb-2">
                      {event.evaluationType === 'inspection' ? 'Inspección' : 'Competencia'}
                    </Badge>
                    {event.weight > 1 && (
                        <Badge variant="outline" className="border-yellow-300 bg-yellow-50 text-yellow-800">
                          x{event.weight} Puntos
                        </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg text-blue-900">{event.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.description || "Sin descripción adicional."}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="text-sm text-slate-500 pb-3">
                   <div className="flex justify-between border-t pt-3">
                      <span>Puntaje Máximo:</span>
                      <span className="font-bold text-slate-900">{event.maxScore} pts</span>
                   </div>
                </CardContent>

                <CardFooter className="grid grid-cols-2 gap-3 pt-0">
                  <Link href={`/judge/score/${event.id}`} className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <PenTool className="mr-2 h-4 w-4" />
                      Evaluar
                    </Button>
                  </Link>
                  <Link href={`/judge/sanction/${event.id}`} className="w-full">
                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Sancionar
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}