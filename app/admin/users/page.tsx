import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getAllUsers } from "@/lib/api" 
// CORRECCIÓN: Importación nombrada con llaves { }
import { UsersListClient } from "@/components/users-list-client" 

export default async function UsersPage() {
  let users: any[] = []
  
  try {
    const rawUsers = await getAllUsers()
    
    // Si rawUsers es un objeto con .data (paginación de Laravel), lo extraemos
    const usersToMap = Array.isArray(rawUsers) ? rawUsers : (rawUsers?.data || [])

    users = usersToMap.map((u: any) => ({
      id: u.id.toString(),
      email: u.email,
      fullName: `${u.name} ${u.last_name || ''}`.trim(),
      role_id: u.role_id,
      isActive: u.is_active, 
    }))

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
            <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
          </Link>
        </Button>
      </div>

      {/* LLAMADA AL COMPONENTE PROTEGIDO */}
      <UsersListClient users={users} />
    </div>
  )
}