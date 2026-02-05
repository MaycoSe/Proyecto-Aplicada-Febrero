import { Button } from "@/components/ui/button"
import { Plus, UserCog, UserX } from "lucide-react" // Agregué iconos extra
import Link from "next/link"
import { User } from "@/lib/types"
import { getAllUsers } from "@/lib/api" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function UsersPage() {
  let users: User[] = []
  
  try {
    const rawUsers = await getAllUsers()
    
    // --- CORRECCIÓN AQUÍ ---
    users = rawUsers.map((u: any) => ({
      id: u.id.toString(),
      email: u.email,
      fullName: `${u.name} ${u.last_name || ''}`.trim(),
      role: u.role_id === 1 ? 'admin' : 'judge',
      role_id: u.role_id, // Aseguramos pasar el ID del rol
      
      // LA CLAVE: Leemos lo que manda Laravel (que calcula !trashed())
      isActive: u.is_active, 
    }))
    // -----------------------

  } catch (error) {
    console.error("Error cargando usuarios:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-950">Gestión de Usuarios</h1>
          <p className="text-slate-500">Administra los jueces y administradores del sistema.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.length === 0 ? (
           <div className="col-span-3 flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed rounded-lg">
             <UserX className="h-10 w-10 mb-2 opacity-50" />
             <p>No hay usuarios registrados.</p>
           </div>
        ) : (
          users.map((user) => (
            <Card key={user.id} className={`transition-all hover:shadow-md ${!user.isActive ? 'opacity-70 bg-slate-50' : ''}`}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarImage src={`/placeholder-user.jpg`} alt={user.fullName} />
                  <AvatarFallback className={user.role_id === 1 ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}>
                    {user.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <CardTitle className="text-base font-semibold truncate text-slate-900">
                    {user.fullName}
                  </CardTitle>
                  <CardDescription className="truncate text-xs">
                    {user.email}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4 mt-2">
                  {/* Badge de ROL */}
                  <Badge variant="outline" className={`capitalize ${user.role_id === 1 ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-orange-200 text-orange-700 bg-orange-50'}`}>
                    {user.role_id === 1 ? 'Administrador' : 'Juez'}
                  </Badge>

                  {/* Badge de ESTADO (Mejorado visualmente) */}
                  {user.isActive ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 shadow-none">
                        Activo
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 shadow-none">
                        Inactivo
                    </Badge>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50" asChild>
                    <Link href={`/admin/users/${user.id}/edit`}>
                        <UserCog className="mr-2 h-4 w-4" />
                        Gestionar
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}