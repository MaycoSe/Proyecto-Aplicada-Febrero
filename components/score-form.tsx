"use client"

import { useActionState, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { mockClubs } from "@/lib/mock-data"
import type { Event } from "@/lib/types"
import { CheckCircle } from "lucide-react"
import { submitScore } from "@/app/actions"

interface ScoreFormProps {
  event: Event
}

// Ítems definidos en el documento de requisitos
const INSPECTION_ITEMS = [
  "Higiene Personal",
  "Uniforme Completo",
  "Limpieza de Carpas",
  "Orden de Mochilas",
  "Herramientas",
  "Cocina y Utensilios",
  "Manejo de Alimentos",
  "Higiene del Entorno",
  "Disciplina",
  "Puntualidad"
]

const initialState = {
  success: false,
  message: ""
}

// OJO AQUÍ: Debe decir "export function" (no export default)
export function ScoreForm({ event }: ScoreFormProps) {
  const router = useRouter()
  
  // Hook para manejar Server Actions
  const [state, formAction, isPending] = useActionState(submitScore, initialState)

  // Estados locales
  const [clubId, setClubId] = useState("")
  const [notes, setNotes] = useState("")
  
  // Estado: Evento Estándar
  const [creativityScore, setCreativityScore] = useState("")
  const [executionScore, setExecutionScore] = useState("")
  const [presentationScore, setPresentationScore] = useState("")
  const [standardTotal, setStandardTotal] = useState("")

  // Estado: Inspección
  const [inspectionScores, setInspectionScores] = useState<Record<string, number>>(
    INSPECTION_ITEMS.reduce((acc, item) => ({ ...acc, [item]: 0 }), {})
  )

  const inspectionTotal = Object.values(inspectionScores).reduce((a, b) => a + b, 0)

  useEffect(() => {
    if (state.success) {
      setClubId("")
      setNotes("")
      setStandardTotal("")
      setCreativityScore("")
      setExecutionScore("")
      setPresentationScore("")
      setInspectionScores(INSPECTION_ITEMS.reduce((acc, item) => ({ ...acc, [item]: 0 }), {}))
    }
  }, [state.success])

  return (
    <Card className="w-full max-w-2xl mx-auto border-t-4 border-t-blue-600 shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{event.name}</span>
          <span className="text-xs font-normal bg-slate-100 text-slate-600 px-2 py-1 rounded-full uppercase tracking-wider">
            {event.evaluationType === "inspection" ? "Inspección Técnica" : "Evento Regular"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          
          {state.success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <input type="hidden" name="eventId" value={event.id} />
          <input type="hidden" name="evaluationType" value={event.evaluationType} />
          <input type="hidden" name="clubId" value={clubId} />
          
          {event.evaluationType === "inspection" ? (
             <input type="hidden" name="inspectionDetails" value={JSON.stringify(inspectionScores)} />
          ) : (
             <>
                <input type="hidden" name="standardTotal" value={standardTotal} />
                <input type="hidden" name="creativityScore" value={creativityScore} />
                <input type="hidden" name="executionScore" value={executionScore} />
                <input type="hidden" name="presentationScore" value={presentationScore} />
             </>
          )}

          <div className="space-y-2">
            <Label>Club a Evaluar</Label>
            <Select value={clubId} onValueChange={setClubId} disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un club..." />
              </SelectTrigger>
              <SelectContent>
                {mockClubs.filter(c => c.isActive).map((club) => (
                  <SelectItem key={club.id} value={club.id}>
                    {club.name} ({club.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-slate-100 my-4" />

          {event.evaluationType === "inspection" ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INSPECTION_ITEMS.map((item) => (
                  <div key={item} className="bg-slate-50 p-4 rounded-lg border space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={item} className="font-medium text-slate-700">{item}</Label>
                      <span className="bg-white border px-2 py-0.5 rounded text-sm font-bold text-blue-600 min-w-[3rem] text-center">
                        {inspectionScores[item]}/10
                      </span>
                    </div>
                    <Slider
                      id={item}
                      min={0}
                      max={10}
                      step={1}
                      value={[inspectionScores[item]]}
                      onValueChange={(val) => setInspectionScores(prev => ({ ...prev, [item]: val[0] }))}
                      disabled={isPending}
                      className="cursor-pointer"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                <span className="text-blue-900 font-medium">Puntaje Total de Inspección</span>
                <span className="text-2xl font-bold text-blue-700">{inspectionTotal} / 100</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2">
                <Label htmlFor="score">Puntaje Total (Máx: {event.maxScore})</Label>
                <Input
                  id="score"
                  type="number"
                  value={standardTotal}
                  onChange={(e) => setStandardTotal(e.target.value)}
                  placeholder="Ej: 95.5"
                  className="text-lg font-bold"
                  disabled={isPending}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['Creatividad', 'Ejecución', 'Presentación'].map((label, i) => {
                    const setters = [setCreativityScore, setExecutionScore, setPresentationScore];
                    const values = [creativityScore, executionScore, presentationScore];
                    return (
                        <div key={label} className="space-y-1">
                            <Label className="text-xs text-muted-foreground">{label}</Label>
                            <Input 
                                type="number" 
                                placeholder="0-100" 
                                value={values[i]}
                                onChange={(e) => setters[i](e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                    )
                })}
              </div>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <Label htmlFor="notes">Observaciones / Feedback</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Detalles sobre descuentos de puntos o felicitaciones..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              disabled={isPending}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isPending || !clubId}
            >
              {isPending ? "Guardando..." : "Confirmar Evaluación"}
            </Button>
            <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={isPending}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}