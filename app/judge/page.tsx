import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { getEvents } from "@/lib/api" // <--- Importamos el fetcher real
import { Event } from "@/lib/types"

export default async function JudgeDashboard() {
  // 1. Obtener eventos reales
  let events: Event[] = []
  
  try {
    events = await getEvents()
  } catch (error) {
    console.error("Error al cargar eventos para el juez:", error)
  }

  // Filtrar solo los activos (opcional, si el backend no lo hace ya)
  const activeEvents = events.filter(e => e.isActive)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Evaluación</h1>
        <p className="text-muted-foreground">Selecciona un evento para comenzar a calificar o registrar sanciones.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeEvents.length === 0 ? (
           <p className="text-muted-foreground col-span-3 text-center py-10">
             No hay eventos activos disponibles para evaluar en este momento.
           </p>
        ) : (
          activeEvents.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant={event.eventType === "Camporee" ? "default" : "secondary"}>
                    {event.eventType || "General"}
                  </Badge>
                  <Badge variant="outline">{event.evaluationType === "inspection" ? "Inspección" : "Estándar"}</Badge>
                </div>
                <CardTitle className="mt-4">{event.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description || "Sin descripción disponible."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Puntaje Máximo:</span>
                    <span className="font-medium text-foreground">{event.maxScore} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peso:</span>
                    <span className="font-medium text-foreground">{event.weight}%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button className="flex-1" asChild>
                  <Link href={`/judge/score/${event.id}`}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Evaluar
                  </Link>
                </Button>
                <Button variant="destructive" size="icon" asChild title="Aplicar Sanción">
                  <Link href={`/judge/sanction/${event.id}`}>
                    <AlertTriangle className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}