"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Trophy, Edit, AlertCircle } from "lucide-react"
import { createClub, updateClub } from "@/app/actions"
import type { Club } from "@/lib/types"

interface ClubFormProps {
  club?: Club
}

const initialState = { success: false, message: "" }

export function ClubForm({ club }: ClubFormProps) {
  const router = useRouter()
  const action = club ? updateClub : createClub
  
  // --- CAMBIO AQUÍ ---
  // Agregamos <any, any> para desactivar el chequeo estricto en 'state'
  const [state, formAction, isPending] = useActionState<any, any>(action, initialState)
  
  const initialActive = club 
    ? (Number(club.is_active) === 1 || club.is_active === true) 
    : true;

  const [isActive, setIsActive] = useState(initialActive)

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => router.push("/admin/clubs"), 1000)
      return () => clearTimeout(timer)
    }
  }, [state.success, router])

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-t-4 border-t-blue-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
            {club ? <Edit className="h-6 w-6 text-orange-600" /> : <Trophy className="h-6 w-6 text-blue-600" />}
            {club ? "Editar Club" : "Nuevo Club"}
        </CardTitle>
        <CardDescription>
          {club ? `Editando: ${club.name} (${club.code})` : "Registra un nuevo club para el Camporee."}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form action={formAction} className="space-y-6">
          
          {state.success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              <AlertDescription className="font-medium">{state.message}</AlertDescription>
            </Alert>
          )}

          {!state.success && state.message && !state.errors && (
             <Alert variant="destructive">
               <AlertCircle className="h-4 w-4 mr-2" />
               <AlertDescription>{state.message}</AlertDescription>
             </Alert>
          )}

          {club && <input type="hidden" name="id" value={club.id} />}
          <input type="hidden" name="is_active" value={isActive ? "1" : "0"} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name">Nombre del Club *</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Ej: Club Orión" 
                defaultValue={club?.name} 
                required 
                className="focus-visible:ring-blue-600"
              />
              {state?.errors?.name && (
                <p className="text-xs text-red-500 mt-1">{state.errors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="code" 
                className={state?.errors?.code ? "text-red-600 font-semibold" : ""}
              >
                Código (Siglas) *
              </Label>
              
              <Input 
                id="code" 
                name="code" 
                placeholder="ORN" 
                defaultValue={club?.code} 
                required 
                maxLength={5} 
                className={`uppercase font-mono tracking-widest ${
                    state?.errors?.code 
                        ? "border-red-500 focus-visible:ring-red-500 bg-red-50 text-red-900 placeholder:text-red-300" 
                        : "focus-visible:ring-blue-600"
                }`} 
              />

              {state?.errors?.code && (
                <div className="text-xs font-medium text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1">
                  <AlertCircle className="h-3 w-3" />
                  {state.errors.code[0]}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción / Lema</Label>
            <Textarea 
                id="description" 
                name="description" 
                placeholder="Lema o descripción breve..." 
                defaultValue={club?.description} 
                rows={3} 
                className="resize-none"
            />
          </div>

          <div className="flex items-center space-x-3 border-t pt-5 bg-slate-50 p-4 rounded-lg">
            <Switch 
                id="switch-ui" 
                checked={isActive} 
                onCheckedChange={setIsActive} 
                className="data-[state=checked]:bg-green-600"
            />
            <div className="grid gap-0.5">
                <Label htmlFor="switch-ui" className="text-base font-medium cursor-pointer">
                    {isActive ? "Club Activo" : "Club Inactivo"}
                </Label>
                <p className="text-xs text-muted-foreground">
                    {isActive 
                        ? "El club aparecerá en los listados y podrá ser evaluado." 
                        : "El club estará oculto para los jueces."}
                </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
                type="submit" 
                className={`flex-1 font-semibold text-white shadow-md transition-all active:scale-95 ${
                    club 
                        ? "bg-orange-600 hover:bg-orange-700" 
                        : "bg-blue-600 hover:bg-blue-700"
                }`} 
                disabled={isPending}
            >
              {isPending ? "Procesando..." : (club ? "Guardar Cambios" : "Registrar Club")}
            </Button>
            
            <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()} 
                disabled={isPending}
                className="hover:bg-slate-100"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}