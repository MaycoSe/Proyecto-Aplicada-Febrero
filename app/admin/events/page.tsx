import { requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockEvents } from "@/lib/mock-data"
import { Plus, Calendar, Edit, Users } from "lucide-react"
import Link from "next/link" // <--- Importante: Importamos Link

export default async function EventsPage() {
  await requireAdmin()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Gestión de Eventos</h1>
          <p className="mt-1 text-slate-600">Administra las actividades, inspecciones y competencias.</p>
        </div>
        
        {/* BOTÓN NUEVO EVENTO CON LINK */}
        <Link href="/admin/events/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Evento
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        {mockEvents.map((event) => (
          <Card key={event.id} className="hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">{event.name}</CardTitle>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                        Tipo: <span className="font-medium capitalize">{event.eventType}</span>
                        {event.evaluationType === 'inspection' && (
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                Inspección Técnica
                            </Badge>
                        )}
                    </p>
                  </div>
                </div>
                <Badge className={event.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}>
                  {event.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 border-t pt-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Puntaje Máximo</p>
                  <p className="text-xl font-bold text-slate-900">{event.maxScore} pts</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Peso / Multiplicador</p>
                  <p className="text-xl font-bold text-slate-900">{event.weight}x</p>
                </div>
                
                {/* BOTONES DE ACCIÓN CON LINKS */}
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/events/${event.id}/edit`}>
                    <Button variant="outline" size="sm" className="text-slate-600">
                      <Edit className="h-3 w-3 mr-2" />
                      Editar
                    </Button>
                  </Link>
                  <Link href={`/admin/events/${event.id}/judges`}>
                    <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100">
                      <Users className="h-3 w-3 mr-2" />
                      Asignar Jueces
                    </Button>
                  </Link>
                </div>
              </div>
              {event.description && (
                  <div className="mt-4 bg-slate-50 p-3 rounded text-sm text-slate-600 italic">
                    "{event.description}"
                  </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}