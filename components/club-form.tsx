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
import { CheckCircle, Trophy, Edit } from "lucide-react"
import { createClub, updateClub } from "@/app/actions"
// Asegúrate de que tu tipo Club tenga is_active opcional o definido
import type { Club } from "@/lib/types"

interface ClubFormProps {
  club?: Club
}

const initialState = { success: false, message: "" }

export function ClubForm({ club }: ClubFormProps) {
  const router = useRouter()
  const action = club ? updateClub : createClub
  const [state, formAction, isPending] = useActionState(action, initialState)
  
  // CORRECCIÓN CRÍTICA:
  // Laravel envía 'is_active', no 'isActive'.
  // Verificamos ambas formas por seguridad.
  const initialActive = club 
    ? (Number(club.is_active) === 1 || club.is_active === true || Number(club.is_active) === 1) 
    : true;

  const [isActive, setIsActive] = useState(initialActive)

  useEffect(() => {
    if (state.success) {
      setTimeout(() => router.push("/admin/clubs"), 1500)
    }
  }, [state.success, router])

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            {club ? <Edit className="h-6 w-6 text-orange-600" /> : <Trophy className="h-6 w-6 text-blue-600" />}
            {club ? "Editar Club" : "Nuevo Club"}
        </CardTitle>
        <CardDescription>
          {club ? `Modificando datos de: ${club.name}` : "Registra un nuevo club participante."}
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

          {club && <input type="hidden" name="id" value={club.id} />}
          
          {/* INPUT OCULTO ÚNICO Y CORRECTO:
              Si isActive es true, envía "on". Si es false, envía string vacío.
          */}
          <input type="hidden" name="isActive" value={isActive ? "on" : ""} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name">Nombre del Club *</Label>
              <Input id="name" name="name" placeholder="Ej: Club Orión" defaultValue={club?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Código (3-4 Letras) *</Label>
              <Input id="code" name="code" placeholder="ORN" defaultValue={club?.code} required maxLength={5} className="uppercase font-mono" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción / Lema</Label>
            <Textarea id="description" name="description" placeholder="Lema o descripción breve..." defaultValue={club?.description} rows={3} />
          </div>

          {/* ZONA DE SWITCH */}
          <div className="flex items-center space-x-2 border-t pt-4">
            <Switch 
                id="switch-ui" // ID diferente al name para evitar conflictos
                checked={isActive} 
                onCheckedChange={setIsActive} 
            />
            <Label htmlFor="switch-ui" className="cursor-pointer">
                {isActive ? "Club ACTIVO (Visible para jueces)" : "Club INACTIVO (Oculto)"}
            </Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className={`flex-1 ${club ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"}`} disabled={isPending}>
              {isPending ? "Guardando..." : (club ? "Guardar Cambios" : "Registrar Club")}
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