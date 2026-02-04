import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { User } from "@/lib/types"
import { getAllUsers } from "@/lib/api" // <--- Usamos la nueva función
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function UsersPage() {
  // 1. Fetch real
  let users: User[] = []
  
  try {
    // Mapeamos la respuesta del backend para asegurar que coincida con la interfaz User
    const rawUsers = await getAllUsers()
    users = rawUsers.map((u: any) => ({
      id: u.id.toString(),
      email: u.email,
      fullName: `${u.name} ${u.last_name || ''}`.trim(),
      role: u.role_id === 1 ? 'admin' : 'judge', // Ajusta según tus IDs de rol
      isActive: true, // O usa u.is_active si tienes ese campo en BD
    }))
  } catch (error) {
    console.error("Error cargando usuarios:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra los jueces y administradores del sistema.</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.length === 0 ? (
           <p className="text-muted-foreground col-span-3 text-center py-10">
             No hay usuarios registrados.
           </p>
        ) : (
          users.map((user) => (
            <Card key={user.id}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/placeholder-user.jpg`} alt={user.fullName} />
                  <AvatarFallback>
                    {user.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-base">{user.fullName}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="capitalize">
                    {user.role_id === 1 ? 'Administrador' : 'Juez'}
                  </Badge>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/users/${user.id}/edit`}>Editar</Link>
                  </Button>
                  {/* Podrías agregar botón de eliminar aquí usando un Client Component */}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}