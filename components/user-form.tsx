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

  // CAMBIO 1: Inicializamos con "2" (Juez) por defecto, o el ID que traiga el usuario
  // Asumimos: 1 = Admin, 2 = Juez
  const [roleId, setRoleId] = useState<string>(user?.role_id?.toString() || "2")
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

          {/* IMPORTANTE: Enviamos contraseña por defecto si es usuario nuevo */}
          {/* El backend la necesita si pusiste 'required' */}
          {!user && <input type="hidden" name="password" value="camp2026" />}

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
              <Label htmlFor="role_id">Rol en el Sistema</Label>
              
              {/* CAMBIO 2: El input oculto ahora se llama 'role_id' y envía números */}
              <input type="hidden" name="role_id" value={roleId} />
              
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione rol..." />
                </SelectTrigger>
                <SelectContent>
                  {/* CAMBIO 3: Los valores son los IDs de tu tabla roles */}
                  <SelectItem value="2">Juez / Evaluador</SelectItem>
                  <SelectItem value="1">Administrador Total</SelectItem>
                </SelectContent>
              </Select>
              
              <p className="text-[10px] text-slate-500">
                  {roleId === '2' 
                    ? "Puede evaluar eventos asignados y aplicar sanciones." 
                    : "Tiene acceso completo a configuración, auditoría y reportes."}
              </p>
            </div>

            {!user && (
                 <div className="bg-slate-50 p-3 rounded border border-slate-200 text-sm text-slate-600">
                    <span className="font-bold">Nota:</span> La contraseña por defecto será <code>camp2026</code>.
                 </div>
            )}
          </div>

          <div className="flex items-center space-x-2 border-t pt-4">
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