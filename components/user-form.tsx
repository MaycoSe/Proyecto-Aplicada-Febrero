"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, UserPlus, UserCog } from "lucide-react"
import { createUser, updateUser } from "@/app/actions"
import type { User } from "@/lib/types"

interface UserFormProps {
  user?: User
}

const initialState = { success: false, message: "" }

export function UserForm({ user }: UserFormProps) {
  const router = useRouter()
  const action = user ? updateUser : createUser
  const [state, formAction, isPending] = useActionState(action, initialState)

  // CORRECCIÓN: Agregamos <string> para evitar el error de tipos en el Select
  const [role, setRole] = useState<string>(user?.role || "judge")
  const [isActive, setIsActive] = useState(user ? user.isActive : true)

  useEffect(() => {
    if (state.success) {
      setTimeout(() => router.push("/admin/users"), 1500)
    }
  }, [state.success, router])

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            {user ? <UserCog className="h-6 w-6 text-orange-600" /> : <UserPlus className="h-6 w-6 text-blue-600" />}
            {user ? "Editar Usuario" : "Nuevo Usuario"}
        </CardTitle>
        <CardDescription>
          {user ? `Editando permisos de: ${user.fullName}` : "Registra un nuevo Juez o Administrador."}
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

          {user && <input type="hidden" name="id" value={user.id} />}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre Completo *</Label>
                    <Input id="fullName" name="fullName" placeholder="Ej: Juan Pérez" defaultValue={user?.fullName} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input id="email" name="email" type="email" placeholder="juan@camporee.com" defaultValue={user?.email} required />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol en el Sistema</Label>
              
              {/* TRUCO: Input oculto para enviar el valor real al servidor */}
              <input type="hidden" name="role" value={role} />
              
              {/* CORRECCIÓN: Usamos una función flecha para satisfacer a TypeScript */}
              <Select value={role} onValueChange={(val: string) => setRole(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione rol..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="judge">Juez / Evaluador</SelectItem>
                  <SelectItem value="admin">Administrador Total</SelectItem>
                </SelectContent>
              </Select>
              
              <p className="text-[10px] text-slate-500">
                  {role === 'judge' 
                    ? "Puede evaluar eventos asignados y aplicar sanciones." 
                    : "Tiene acceso completo a configuración, auditoría y reportes."}
              </p>
            </div>

            {!user && (
                 <div className="bg-slate-50 p-3 rounded border border-slate-200 text-sm text-slate-600">
                    <span className="font-bold">Nota:</span> La contraseña por defecto será <code>camp2026</code>. El usuario podrá cambiarla al iniciar sesión.
                 </div>
            )}
          </div>

          <div className="flex items-center space-x-2 border-t pt-4">
            {/* TRUCO: Input oculto para el Switch */}
            <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />
            
            <Switch 
                id="isActive" 
                checked={isActive} 
                onCheckedChange={setIsActive} 
            />
            <Label htmlFor="isActive">Usuario activo (Permitir acceso)</Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className={`flex-1 ${user ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"}`} disabled={isPending}>
              {isPending ? "Guardando..." : (user ? "Guardar Cambios" : "Crear Usuario")}
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