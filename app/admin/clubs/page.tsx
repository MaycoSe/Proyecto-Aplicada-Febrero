import { requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockClubs } from "@/lib/mock-data"
import { Plus, Trophy, FileBarChart, Edit } from "lucide-react"
import Link from "next/link"

export default async function ClubsPage() {
  await requireAdmin()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Clubes Inscritos</h1>
          <p className="mt-1 text-slate-600">Administra los clubes que participan en el Camporee.</p>
        </div>
        
        {/* BOTÓN NUEVO CLUB */}
        <Link href="/admin/clubs/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Club
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockClubs.map((club) => (
          <Card key={club.id} className="group hover:border-blue-400 transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="bg-blue-100 p-2 rounded-full">
                    <Trophy className="h-6 w-6 text-blue-700" />
                </div>
                <Badge className={club.isActive ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}>
                    {club.isActive ? "Habilitado" : "Deshabilitado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {club.name}
                </h3>
                <p className="text-sm font-mono text-slate-500 bg-slate-100 w-fit px-2 py-0.5 rounded mt-1">
                    Cód: {club.code}
                </p>
              </div>
              
              {club.description && (
                <p className="text-sm text-slate-600 line-clamp-2 h-10">
                    {club.description}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                {/* BOTÓN EDITAR */}
                <Link href={`/admin/clubs/${club.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-3 w-3 mr-2" />
                    Editar
                  </Button>
                </Link>

                {/* BOTÓN PUNTAJES */}
                <Link href={`/admin/clubs/${club.id}/scores`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100">
                    <FileBarChart className="h-3 w-3 mr-2" />
                    Puntajes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}