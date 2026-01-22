import { requireAdmin } from "@/lib/auth"
import { UserForm } from "@/components/user-form"
import { mockUsers } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditUserPage({ params }: PageProps) {
  await requireAdmin()
  const { id } = await params // Resolvemos la promesa
  
  // Buscamos el usuario en la "base de datos"
  const user = mockUsers.find((u) => u.id === id)

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