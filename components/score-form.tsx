"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { submitScore } from "@/app/actions"

interface ScoreFormProps {
  event: any
  clubs: any[]
  eventId: string
}

const INSPECTION_ITEMS = [
  "Higiene Personal", "Uniforme Completo", "Limpieza de Carpas", 
  "Orden de Mochilas", "Herramientas", "Cocina y Utensilios", 
  "Manejo de Alimentos", "Higiene del Entorno", "Disciplina", "Puntualidad"
]

export function ScoreForm({ event, clubs, eventId }: ScoreFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  // Detección de modo (Inspección o Standard)
  const isInspection = (event.evaluation_type ?? event.evaluationType) === "inspection"
  const eventMaxScore = Number(event.max_score ?? event.maxScore ?? 100)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clubId, setClubId] = useState("")
  const [notes, setNotes] = useState("")
  
  // Estados para modo Standard
  const [creativity, setCreativity] = useState("")
  const [execution, setExecution] = useState("")
  const [presentation, setPresentation] = useState("")

  // Estado para modo Inspección
  const [inspectionScores, setInspectionScores] = useState<Record<string, number>>(
    INSPECTION_ITEMS.reduce((acc, item) => ({ ...acc, [item]: 10 }), {})
  )

  // Cálculos de totales
  const inspectionTotal = Object.values(inspectionScores).reduce((a, b) => a + b, 0)
  
  // Convertimos a float los inputs de texto, si están vacíos suman 0
  const standardTotal = (parseFloat(creativity) || 0) + 
                        (parseFloat(execution) || 0) + 
                        (parseFloat(presentation) || 0)

  const currentTotal = isInspection ? inspectionTotal : standardTotal
  
  // --- VALIDACIONES DE LÍMITES ---
  const isOverLimit = currentTotal > eventMaxScore
  // Aquí está la restricción que pediste: Bloquea si es 0 o negativo
  const isZeroOrLess = currentTotal <= 0 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!clubId) {
        toast({ title: "Falta información", description: "Selecciona un club", variant: "destructive" })
        return
    }

    // --- BLOQUEO DE ENVÍO SI ES <= 0 ---
    if (isZeroOrLess) {
        toast({ 
            title: "Puntaje Inválido", 
            description: "El puntaje total debe ser mayor a 0.", 
            variant: "destructive" 
        })
        return
    }

    if (isOverLimit) {
        toast({ 
            title: "Puntaje Inválido", 
            description: `El puntaje supera el máximo permitido de ${eventMaxScore}.`, 
            variant: "destructive" 
        })
        return
    }

    setIsSubmitting(true)

    const details = isInspection 
        ? inspectionScores 
        : { 
            creativity: parseFloat(creativity) || 0, 
            execution: parseFloat(execution) || 0, 
            presentation: parseFloat(presentation) || 0 
          }

    const formData = new FormData()
    formData.append("event_id", eventId) 
    formData.append("club_id", clubId)
    formData.append("score", currentTotal.toString())
    formData.append("feedback", notes)
    formData.append("details", JSON.stringify(details))

    try {
        const result = await submitScore(formData)
        if (!result.success) throw new Error(result.message)

        toast({ title: "Evaluación Guardada", description: "Puntaje registrado correctamente." })
        
        // Reset del formulario
        setClubId("")
        setNotes("")
        setCreativity("")
        setExecution("")
        setPresentation("")
        // Reiniciar sliders a 10 (o a 0 si prefieres)
        setInspectionScores(INSPECTION_ITEMS.reduce((acc, item) => ({ ...acc, [item]: 10 }), {}))
        router.refresh()
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-t-4 border-t-blue-600 shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{event.name}</span>
          <div className="flex flex-col items-end gap-1">
             <span className="text-xs font-normal bg-slate-100 text-slate-600 px-2 py-1 rounded-full uppercase tracking-wider">
               {isInspection ? "Inspección Técnica" : "Evaluación Standard"}
             </span>
             <span className="text-xs font-bold text-blue-700">Máx: {eventMaxScore} pts</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <Label>Club a Evaluar</Label>
            <Select value={clubId} onValueChange={setClubId} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un club..." />
              </SelectTrigger>
              <SelectContent>
                {clubs.map((club) => (
                  <SelectItem key={club.id} value={club.id.toString()}>
                    {club.name} ({club.code || 'S/C'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-slate-100 my-4" />

          {isInspection ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
              {INSPECTION_ITEMS.map((item) => (
                <div key={item} className="bg-slate-50 p-4 rounded-lg border space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-slate-700">{item}</Label>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                        inspectionScores[item] < 10 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {inspectionScores[item]}/10
                    </span>
                  </div>
                  <Slider
                    min={0} max={10} step={1}
                    value={[inspectionScores[item]]}
                    onValueChange={(val) => setInspectionScores(prev => ({ ...prev, [item]: val[0] }))}
                    disabled={isSubmitting}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
               {[
                 { label: "Creatividad", val: creativity, set: setCreativity },
                 { label: "Ejecución", val: execution, set: setExecution },
                 { label: "Presentación", val: presentation, set: setPresentation }
               ].map(field => (
                 <div key={field.label} className="space-y-2">
                   <Label>{field.label}</Label>
                   <Input 
                     type="number" 
                     min="0" // Evita negativos en el input HTML
                     step="0.01" // Permite decimales
                     placeholder="0.00" 
                     value={field.val} 
                     onChange={(e) => field.set(e.target.value)}
                     className="text-center font-bold"
                     disabled={isSubmitting}
                   />
                 </div>
               ))}
            </div>
          )}

          {/* --- BARRA DE TOTAL CON ALERTAS --- */}
          <div className={`flex items-center justify-between p-4 rounded-lg border sticky bottom-0 z-10 shadow-sm transition-colors ${
              isOverLimit || isZeroOrLess ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-100"
          }`}>
              <div className="flex flex-col">
                 <span className="text-sm font-bold text-slate-600">Total Acumulado</span>
                 {isOverLimit && (
                    <span className="text-[10px] text-red-600 font-bold flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1"/> Supera el máximo
                    </span>
                 )}
                 {isZeroOrLess && (
                    <span className="text-[10px] text-red-600 font-bold flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1"/> Debe ser mayor a 0
                    </span>
                 )}
              </div>
              <span className={`text-4xl font-black ${isOverLimit || isZeroOrLess ? "text-red-600" : "text-blue-700"}`}>
                 {currentTotal.toFixed(1)}
              </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observaciones</Label>
            <Textarea 
              id="notes" value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas sobre el desempeño..." 
              disabled={isSubmitting}
            />
          </div>

          <Button 
            type="submit" 
            // Deshabilitamos el botón si es 0, menor a 0 o se pasa del límite
            className={`w-full h-12 text-lg font-bold transition-all ${
                isOverLimit || isZeroOrLess 
                    ? "bg-red-400 cursor-not-allowed hover:bg-red-400" 
                    : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isSubmitting || !clubId || isOverLimit || isZeroOrLess}
          >
            {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <CheckCircle className="mr-2"/>}
            {isOverLimit ? "Corregir Puntaje" : (isZeroOrLess ? "Puntaje Inválido" : "Confirmar Evaluación")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}