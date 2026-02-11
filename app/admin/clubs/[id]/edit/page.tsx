import { requireAdmin } from "@/lib/auth"
import { ClubForm } from "@/components/club-form"
import { getClubById } from "@/lib/api" // <--- Importamos la función real
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditClubPage({ params }: PageProps) {
  // 1. Verificar seguridad
  await requireAdmin()
  
  // 2. Resolver parámetros (Obligatorio en Next.js 15/16)
  const { id } = await params 

  // 3. Buscar el club REAL en la base de datos
  // Usamos .catch(() => null) para manejar si la API falla o devuelve 404
  const club = await getClubById(id).catch(() => null)

  // 4. Si no existe, mostrar página 404
  if (!club) {
    notFound()
  }

  return (
    <div className="container max-w-3xl py-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2">
        <Link href="/admin/clubs">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="mr-1 h-4 w-4" /> Cancelar y Volver
            </Button>
        </Link>
      </div>
      
      <div className="px-1 border-l-4 border-emerald-500 pl-4">
         <h1 className="text-3xl font-bold text-emerald-950">Editar Club</h1>
         <p className="text-slate-600">
            Actualiza la información de <strong>{club.name}</strong>.
         </p>
      </div>

      {/* Pasamos el club real al formulario */}
      <ClubForm club={club} />
    </div>
  )
}