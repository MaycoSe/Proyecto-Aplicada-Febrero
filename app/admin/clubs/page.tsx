export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getClubs } from "@/lib/api"
import { ClubsListClient } from "@/components/clubs-list-client"
import { Suspense } from "react" // <--- Importá esto

// 1. Creamos un subcomponente que hace la carga de datos
async function ClubsData() {
  try {
    const clubs = await getClubs()
    return <ClubsListClient clubs={clubs} />
  } catch (error) {
    console.error("Error cargando clubes:", error)
    return <p className="text-red-500">Error al cargar los clubes.</p>
  }
}

export default function ClubsPage() {
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

      {/* 2. Envolvemos el cargador de datos en Suspense */}
      <Suspense fallback={<p>Cargando lista de clubes...</p>}>
        <ClubsData />
      </Suspense>
    </div>
  )
}