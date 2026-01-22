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
import { CheckCircle, CalendarPlus, Edit } from "lucide-react"
import { createEvent, updateEvent } from "@/app/actions"
import type { Event } from "@/lib/types"

interface EventFormProps {
  event?: Event
}

const initialState = {
  success: false,
  message: ""
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  
  // Determinamos si es crear o editar
  const action = event ? updateEvent : createEvent
  const [state, formAction, isPending] = useActionState(action, initialState)
  
  // Estados locales
  const [evalType, setEvalType] = useState<string>(event?.evaluationType || "standard")
  const [eventType, setEventType] = useState<string>(event?.eventType || "General")

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

          {event && <input type="hidden" name="id" value={event.id} />}

          {/* Nombre y Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Evento *</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Ej: Marchas, Inspección..." 
                defaultValue={event?.name} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventType">Categoría</Label>
              <input type="hidden" name="eventType" value={eventType} />
              
              <Select 
                value={eventType} 
                onValueChange={(val: string) => setEventType(val)}
              >
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

          {/* Configuración de Evaluación */}
          <div className="space-y-3 border p-4 rounded-lg bg-slate-50">
             <Label className="text-blue-900 font-semibold">Configuración de Evaluación</Label>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="evaluationType">Método de Calificación *</Label>
                    
                    <input type="hidden" name="evaluationType" value={evalType} />
                    
                    <Select 
                        value={evalType} 
                        onValueChange={(val: string) => setEvalType(val)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="standard">Estándar (Creatividad/Ejecución)</SelectItem>
                            <SelectItem value="inspection">Inspección (10 Ítems Fijos)</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <p className="text-[10px] text-slate-500">
                        {evalType === 'inspection' 
                            ? "10 ítems fijos (Higiene, Uniforme, etc.) del 1 al 10."
                            : "Puntaje global desglosado por criterio subjetivo."}
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="maxScore">Puntaje Máximo *</Label>
                    <Input 
                        id="maxScore" 
                        name="maxScore" 
                        type="number" 
                        defaultValue={event?.maxScore || 100} 
                        required 
                    />
                </div>
             </div>
          </div>

          {/* Peso y Descripción */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="col-span-1 space-y-2">
                <Label htmlFor="weight">Peso (Multiplicador)</Label>
                <Input 
                    id="weight" 
                    name="weight" 
                    type="number" 
                    defaultValue={event?.weight || 1} 
                    min="1" 
                    step="0.1" 
                />
             </div>
             <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Descripción (Opcional)</Label>
                <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Detalles para el juez..." 
                    defaultValue={event?.description}
                    rows={2} 
                />
             </div>
          </div>

          <div className="flex items-center space-x-2 border-t pt-4">
            <Switch 
                id="isActive" 
                name="isActive" 
                defaultChecked={event ? event.isActive : true} 
            />
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