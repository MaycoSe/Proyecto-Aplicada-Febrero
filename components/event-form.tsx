"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, CalendarPlus, Edit, Lock, MapPin, Calendar } from "lucide-react"
import { createEvent, updateEvent } from "@/app/actions"

interface EventFormProps {
  event?: any 
}

const initialState = {
  success: false,
  message: ""
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  
  // Determinamos la fecha de hoy para la validación (formato YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0]
  
  // Si el evento tiene fecha, nos aseguramos que esté en formato YYYY-MM-DD para el input
  const eventDate = event?.date ? event.date.split('T')[0] : ""

  const action = event ? updateEvent : createEvent
  const [state, formAction, isPending] = useActionState(action, initialState)
  
  // --- ESTADOS ---
  const [evalType, setEvalType] = useState<string>(
    event?.evaluation_type ?? event?.evaluationType ?? "standard"
  )
  const [eventType, setEventType] = useState<string>(
    event?.event_type ?? "General"
  )
  const [isActive, setIsActive] = useState(event ? Boolean(event.is_active) : true)
  const [maxScoreValue, setMaxScoreValue] = useState<string>(
    (event?.max_score ?? event?.maxScore ?? 100).toString()
  )

  // --- LÓGICA DE VALIDACIÓN ---
  useEffect(() => {
    if (evalType === "inspection") {
      setMaxScoreValue("100")
    }
  }, [evalType])

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push("/admin/events")
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [state.success, router])

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            {event ? <Edit className="h-6 w-6 text-orange-600" /> : <CalendarPlus className="h-6 w-6 text-blue-600" />}
            {event ? "Editar Evento" : "Nuevo Evento"}
        </CardTitle>
        <CardDescription>
          {event ? `Modificando: ${event.name}` : "Configura una nueva actividad competitiva o inspección."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          
          {state.success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {/* INPUTS OCULTOS */}
          {event && (
            <>
                <input type="hidden" name="id" value={event.id} />
                <input type="hidden" name="_method" value="PUT" />
            </>
          )}
          
          <input type="hidden" name="is_active" value={isActive ? "1" : "0"} />
          <input type="hidden" name="evaluationType" value={evalType} />
          <input type="hidden" name="eventType" value={eventType} />
          
          {evalType === "inspection" && (
            <input type="hidden" name="maxScore" value="100" />
          )}

          {/* Fila 1: Nombre y Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Evento *</Label>
              <Input id="name" name="name" defaultValue={event?.name} placeholder="Ej: Marchas, Inspección..." required />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Deportivo">Deportivo</SelectItem>
                  <SelectItem value="Técnica">Técnica / Pionerismo</SelectItem>
                  <SelectItem value="Espiritual">Espiritual / Bíblico</SelectItem>
                  <SelectItem value="General">General / Campamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fila 2: Fecha y Ubicación (Nuevos campos) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" /> Fecha del Evento *
              </Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                min={today} // Validación: No permite días pasados
                defaultValue={eventDate} 
                required 
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" /> Ubicación
              </Label>
              <Input 
                id="location" 
                name="location" 
                placeholder="Ej: Campo Central, Estadio..." 
                defaultValue={event?.location} 
              />
            </div> */}
          </div>

          {/* Configuración de Evaluación */}
          <div className="space-y-3 border p-4 rounded-lg bg-slate-50">
             <Label className="text-blue-900 font-semibold">Configuración de Evaluación</Label>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Método de Calificación *</Label>
                    <Select value={evalType} onValueChange={setEvalType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="standard">Estándar (Creatividad/Ejecución)</SelectItem>
                            <SelectItem value="inspection">Inspección (10 Ítems Fijos)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="maxScore" className="flex items-center gap-1">
                      Puntaje Máximo *
                      {evalType === "inspection" && <Lock className="w-3 h-3 text-slate-400" />}
                    </Label>
                    <Input 
                        id="maxScore" 
                        name={evalType === "inspection" ? "" : "maxScore"} 
                        type="number" 
                        value={maxScoreValue}
                        onChange={(e) => setMaxScoreValue(e.target.value)}
                        disabled={evalType === "inspection"}
                        className={evalType === "inspection" ? "bg-slate-100 font-bold text-blue-700" : ""}
                        required 
                    />
                </div>
             </div>
          </div>

          {/* Peso y Descripción */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="col-span-1 space-y-2">
                <Label htmlFor="weight">Peso (Multiplicador)</Label>
                <Input id="weight" name="weight" type="number" defaultValue={event?.weight || 1} min="1" step="0.1" />
             </div>
             <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Descripción (Opcional)</Label>
                <Textarea id="description" name="description" defaultValue={event?.description} rows={2} />
             </div>
          </div>

          <div className="flex items-center space-x-2 border-t pt-4">
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="isActive">Habilitar evento inmediatamente</Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
                type="submit" 
                className={`flex-1 ${event ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"}`} 
                disabled={isPending}
            >
              {isPending ? "Guardando..." : (event ? "Guardar Cambios" : "Crear Evento")}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}