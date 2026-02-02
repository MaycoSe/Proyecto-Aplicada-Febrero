import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Club } from "@/lib/types" // Asegúrate de importar la interfaz
import { getClubs } from "@/lib/api" // <--- Importamos nuestra nueva función
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ClubsPage() {
  // 1. Obtenemos datos reales del backend
  let clubs: Club[] = []
  
  try {
    clubs = await getClubs()
  } catch (error) {
    console.error("Error cargando clubes:", error)
    // Podrías manejar un estado de error visual aquí
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Clubes</h1>
          <p className="text-muted-foreground">Administra los clubes participantes en el camporee.</p>
        </div>
        <Button asChild>
          <Link href="/admin/clubs/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Club
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clubs.length === 0 ? (
           <p className="text-muted-foreground col-span-3 text-center py-10">
             No hay clubes registrados o no se pudo conectar con el servidor.
           </p>
        ) : (
          clubs.map((club) => (
            <Card key={club.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-xl">{club.name}</CardTitle>
                  <CardDescription>Código: {club.code}</CardDescription>
                </div>
                <Badge variant={club.is_active ? "default" : "secondary"}>
                  {club.is_active ? "Activo" : "Inactivo"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/clubs/${club.id}/edit`}>Editar</Link>
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/admin/clubs/${club.id}/scores`}>Puntajes</Link>
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