"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Users, Shield } from "lucide-react"
import { assignJudges } from "@/app/actions"
import type { Event, User } from "@/lib/types"

interface AssignJudgesFormProps {
  event: Event
  judges: User[]
}

const initialState = {
  success: false,
  message: ""
}

export function AssignJudgesForm({ event, judges }: AssignJudgesFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(assignJudges, initialState)

  // IDs de jueces ya asignados previamente
  const currentlyAssigned = event.assignedJudges || []

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push("/admin/events")
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [state.success, router])

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-t-4 border-t-purple-600">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-700" />
            </div>
            <div>
                <CardTitle>Asignar Jueces</CardTitle>
                <CardDescription>
                    Selecciona quiénes podrán calificar el evento <strong>"{event.name}"</strong>.
                </CardDescription>
            </div>
        </div>
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

          <div className="divide-y border rounded-lg overflow-hidden">
            {judges.length === 0 && (
                <div className="p-6 text-center text-slate-500">
                    No hay usuarios con rol de "Juez" registrados en el sistema.
                </div>
            )}

            {judges.map((judge) => {
              const isAssigned = currentlyAssigned.includes(judge.id)
              return (
                <div key={judge.id} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/placeholder-user.jpg`} />
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                        {judge.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{judge.fullName}</p>
                      <p className="text-xs text-slate-500">{judge.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`judge-${judge.id}`} className="text-xs text-slate-400 font-normal mr-2">
                        {isAssigned ? "Asignado" : "No asignado"}
                    </Label>
                    <Switch 
                        id={`judge-${judge.id}`} 
                        name="judges" 
                        value={judge.id} 
                        defaultChecked={isAssigned} 
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
                type="submit" 
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isPending || judges.length === 0}
            >
              {isPending ? "Guardando cambios..." : "Guardar Asignación"}
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