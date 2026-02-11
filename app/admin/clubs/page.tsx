import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getClubs } from "@/lib/api"
// Importamos el componente interactivo
import { ClubsListClient } from "@/components/clubs-list-client"

export default async function ClubsPage() {
  let clubs = []
  
  try {
    clubs = await getClubs()
  } catch (error) {
    console.error("Error cargando clubes:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Clubes</h1>
          <p className="text-slate-500">Administra los clubes participantes en el camporee.</p>
        </div>
        <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white shadow-md">
          <Link href="/admin/clubs/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Club
          </Link>
        </Button>
      </div>

      {/* Le pasamos los datos al componente seguro */}
      <ClubsListClient clubs={clubs} />
    </div>
  )
}