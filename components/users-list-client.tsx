"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserCog, UserX, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import Link from "next/link"

// IMPORTANTE: Exportación nombrada
export function UsersListClient({ users }: { users: any }) {
  // ESCUDO ANTI-ERROR: Si 'users' no es array, lo arreglamos aquí mismo.
  const usersArray = Array.isArray(users) 
    ? users 
    : (users?.data && Array.isArray(users.data) ? users.data : []);

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // 1. Filtrado seguro usando el array protegido
  const filteredUsers = usersArray.filter((u: any) =>
    (u.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre o correo..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        {searchTerm && (
          <Button variant="ghost" onClick={() => { setSearchTerm(""); setCurrentPage(1); }}>
            <RotateCcw className="h-4 w-4 mr-2" /> Limpiar
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedUsers.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed rounded-lg">
            <UserX className="h-10 w-10 mb-2 opacity-50" />
            <p>No se encontraron usuarios.</p>
          </div>
        ) : (
          paginatedUsers.map((user: any) => (
            <Card key={user.id} className={`transition-all hover:shadow-md ${!user.isActive ? 'opacity-70 bg-slate-50' : ''}`}>
               <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarFallback className={user.role_id === 1 ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}>
                    {user.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <CardTitle className="text-base font-semibold truncate">
                    {user.fullName}
                  </CardTitle>
                  <CardDescription className="truncate text-xs">
                    {user.email}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4 mt-2">
                  <Badge variant="outline" className="capitalize">
                    {user.role_id === 1 ? 'Administrador' : 'Juez'}
                  </Badge>
                  <Badge className={user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                    {user.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div className="flex justify-end pt-2 border-t">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/users/${user.id}/edit`}>
                        <UserCog className="mr-2 h-4 w-4" /> Gestionar
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6 border-t">
          <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">Página {currentPage} de {totalPages}</span>
          <Button variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}