"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, UserCheck, Plus, X, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { assignJudges } from "@/app/actions"

interface User {
  id: string
  name: string
  email: string
}

interface AssignJudgesFormProps {
  event: any
  judges: User[]
  eventId: string
}

export function AssignJudgesForm({ event, judges, eventId }: AssignJudgesFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  // Lista de IDs seleccionados (empieza con los que ya estaban en la BD)
  const [selectedJudges, setSelectedJudges] = useState<string[]>(
    event.assignedJudges || []
  )
  
  // El juez que está seleccionado temporalmente en el dropdown (antes de darle agregar)
  const [judgeToAdd, setJudgeToAdd] = useState<string>("")
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Filtramos: Solo mostramos en el dropdown a los que NO están ya seleccionados
  const availableJudges = judges.filter(j => !selectedJudges.includes(j.id.toString()))

  // 2. Helper para agregar
  const handleAddJudge = () => {
    if (!judgeToAdd) return
    setSelectedJudges(prev => [...prev, judgeToAdd])
    setJudgeToAdd("") // Limpiamos el dropdown
  }

  // 3. Helper para quitar
  const handleRemoveJudge = (judgeId: string) => {
    setSelectedJudges(prev => prev.filter(id => id !== judgeId))
  }

  // 4. Guardar en Base de Datos
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    const formData = new FormData()
    
    formData.append("eventId", eventId)
    
    selectedJudges.forEach(id => {
        formData.append("judges", id)
    })

    const result = await assignJudges(null, formData)
    
    setIsSubmitting(false)

    if (result.success) {
      toast({ title: "Cambios guardados", description: result.message })
      router.refresh()
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" })
    }
  }

  return (
    <Card className="border-t-4 border-t-purple-600 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl text-blue-900">Equipo de Jueces</CardTitle>
                <CardDescription>
                    Agrega los jueces que evaluarán el evento <strong>{event.name}</strong>.
                </CardDescription>
            </div>
            <Badge variant="outline" className="text-purple-700 bg-purple-50 border-purple-200 text-base px-3 py-1">
                {selectedJudges.length} Asignados
            </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        
        {/* ZONA DE SELECCIÓN (DROPDOWN + BOTÓN) */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
                <Select value={judgeToAdd} onValueChange={setJudgeToAdd}>
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Seleccionar un juez de la lista..." />
                    </SelectTrigger>
                    <SelectContent>
                        {availableJudges.length > 0 ? (
                            availableJudges.map((judge) => (
                                <SelectItem key={judge.id} value={judge.id.toString()}>
                                    {judge.name} ({judge.email})
                                </SelectItem>
                            ))
                        ) : (
                            <div className="p-2 text-sm text-muted-foreground text-center">
                                No quedan más jueces disponibles.
                            </div>
                        )}
                    </SelectContent>
                </Select>
            </div>
            <Button 
                onClick={handleAddJudge} 
                disabled={!judgeToAdd}
                className="bg-blue-600 hover:bg-blue-700"
            >
                <Plus className="mr-2 h-4 w-4" /> Agregar Juez
            </Button>
        </div>

        {/* LISTA DE JUECES ASIGNADOS */}
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Jueces en este evento
            </h3>
            
            {selectedJudges.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg text-slate-400 bg-slate-50">
                    <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No hay jueces asignados todavía.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedJudges.map((judgeId) => {
                    // Buscamos los datos completos del juez para mostrarlos
                    const judge = judges.find(j => j.id.toString() === judgeId)
                    if (!judge) return null

                    return (
                        <div key={judgeId} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm group hover:border-red-200 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <Avatar className="h-9 w-9 border">
                                    <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                                        {judge.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm text-slate-900 truncate">{judge.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{judge.email}</p>
                                </div>
                            </div>
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveJudge(judgeId)}
                                className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                title="Quitar juez"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* BOTÓN DE GUARDAR */}
        <div className="flex justify-end pt-6 border-t mt-4">
             <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto min-w-[200px] h-11 text-base"
             >
                {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Guardando...</>
                ) : (
                    <><UserCheck className="mr-2 h-5 w-5" /> Confirmar Asignación</>
                )}
             </Button>
        </div>
      </CardContent>
    </Card>
  )
}