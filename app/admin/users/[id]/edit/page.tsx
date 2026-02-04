import { requireAdmin, getAuthToken } from "@/lib/auth" // Asegúrate de importar getAuthToken
import { UserForm } from "@/components/user-form"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types" // Importamos tu tipo

// Definimos la URL de la API (ajusta si la tienes en otro lado)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// Función auxiliar para buscar el usuario real
async function getUser(id: string): Promise<User | null> {
  const token = await getAuthToken()
  
  try {
    const res = await fetch(`${API_URL}/users/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
      cache: "no-store", // Importante: No guardar caché para ver cambios al instante
    })

    if (!res.ok) return null

    const backendUser = await res.json()

    // TRANSFORMACIÓN DE DATOS (El Puente Backend -> Frontend)
    return {
      id: backendUser.id,
      fullName: backendUser.name, // Laravel manda 'name', el form quiere 'fullName'
      email: backendUser.email,
      role_id: backendUser.role_id,
      role: backendUser.role_id === 1 ? "Admin" : "Juez",
      isActive: backendUser.is_active === 1 || backendUser.is_active === true,
      createdAt: backendUser.created_at,
      updatedAt: backendUser.updated_at,
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export default async function EditUserPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params
  
  // AHORA BUSCAMOS EL USUARIO REAL
  const user = await getUser(id)

  if (!user) {
    notFound()
  }

  return (
    <div className="container max-w-3xl py-6 space-y-6 animate-in slide-in-from-right-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/users">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="mr-1 h-4 w-4" /> Cancelar
            </Button>
        </Link>
      </div>
      
      <div className="px-1 border-l-4 border-orange-500 pl-4">
         <h1 className="text-3xl font-bold text-orange-800">Editar Usuario</h1>
         <p className="text-slate-600">
            Modificando permisos y datos de <strong>{user.fullName}</strong>.
         </p>
      </div>

      <UserForm user={user} />
    </div>
  )
}