"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Trophy, Shield, Edit, FileText, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import Link from "next/link"

// Exportación nombrada para evitar errores de importación
export function ClubsListClient({ clubs }: { clubs: any }) {
  
  // 🛡️ ESCUDO ANTI-ERROR: Normalizamos la respuesta de Laravel
  const clubsArray = Array.isArray(clubs) 
    ? clubs 
    : (clubs?.data && Array.isArray(clubs.data) ? clubs.data : []);

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // 1. Lógica de Filtrado (Nombre y Código)
  const filteredClubs = clubsArray.filter((club: any) =>
    (club.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (club.code || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 2. Paginación
  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedClubs = filteredClubs.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      {/* BARRA DE BÚSQUEDA */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre o código..."
            className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        {searchTerm && (
          <Button variant="ghost" onClick={() => { setSearchTerm(""); setCurrentPage(1); }} className="text-slate-500">
            <RotateCcw className="h-4 w-4 mr-2" /> Limpiar
          </Button>
        )}
      </div>

      {/* GRILLA DE CLUBES */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedClubs.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed rounded-lg bg-slate-50">
            <Shield className="h-10 w-10 mb-2 opacity-50" />
            <p>No se encontraron clubes.</p>
          </div>
        ) : (
          paginatedClubs.map((club: any) => (
            <Card key={club.id} className="hover:shadow-lg transition-all border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-orange-500" />
                    {club.name}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs bg-slate-100 px-2 py-1 rounded w-fit text-slate-600">
                    CÓD: {club.code}
                  </CardDescription>
                </div>
                <Badge variant={club.is_active ? "default" : "secondary"} className={club.is_active ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                  {club.is_active ? "Activo" : "Inactivo"}
                </Badge>
              </CardHeader>
              
              <CardContent>
                {/* Aquí podrías agregar el Director si la API lo devuelve en el futuro */}
                {/* <div className="text-sm text-slate-500 mb-4">Director: {club.director_name}</div> */}

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-2">
                  <Button variant="outline" size="sm" asChild className="border-slate-300 text-slate-600">
                    <Link href={`/admin/clubs/${club.id}/edit`}>
                        <Edit className="h-3 w-3 mr-1" /> Editar
                    </Link>
                  </Button>
                  <Button variant="secondary" size="sm" asChild className="bg-orange-50 text-orange-700 hover:bg-orange-100">
                    <Link href={`/admin/clubs/${club.id}/scores`}>
                        <FileText className="h-3 w-3 mr-1" /> Puntajes
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-slate-100">
          <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-semibold text-slate-600">
            Página <span className="text-orange-600">{currentPage}</span> de {totalPages}
          </div>
          <Button variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}