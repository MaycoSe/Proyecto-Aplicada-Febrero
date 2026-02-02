import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Event } from "@/lib/types"
import { getEvents } from "@/lib/api" // <--- Importamos el fetcher real
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function EventsPage() {
  // 1. Obtenemos datos reales
  let events: Event[] = []
  
  try {
    events = await getEvents()
  } catch (error) {
    console.error("Error cargando eventos:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Eventos</h1>
          <p className="text-muted-foreground">Administra los eventos y competencias del camporee.</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Evento
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <p className="text-muted-foreground col-span-3 text-center py-10">
            No hay eventos registrados.
          </p>
        ) : (
          events.map((event) => (
            <Card key={event.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-xl">{event.name}</CardTitle>
                  <CardDescription>{event.eventType}</CardDescription>
                </div>
                <Badge variant={event.isActive ? "default" : "secondary"}>
                  {event.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Puntaje Máx:</span>
                    <span className="font-medium">{event.maxScore}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Peso:</span>
                    <span className="font-medium">{event.weight}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Evaluación:</span>
                    <span className="font-medium capitalize">
                       {event.evaluationType === "inspection" ? "Inspección" : "Estándar"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/events/${event.id}/edit`}>Editar</Link>
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/admin/events/${event.id}/judges`}>Jueces</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}