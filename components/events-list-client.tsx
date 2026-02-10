"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw, Filter } from "lucide-react"
import Link from "next/link"

export function EventsListClient({ events }: { events: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // NUEVO
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 

  const filteredEvents = events.filter((event) => {
    const matchesName = event.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filtro de Fecha
    const eventDate = event.date ? event.date.split('T')[0] : ""
    const matchesDate = !dateFilter || eventDate === dateFilter
    
    // Filtro de Estado (Nuevo)
    const isActive = event.is_active === 1 || event.is_active === true;
    const matchesStatus = statusFilter === "all" 
        ? true 
        : statusFilter === "active" ? isActive : !isActive;
    
    return matchesName && matchesDate && matchesStatus
  })

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
      setSearchTerm("");
      setDateFilter("");
      setStatusFilter("all");
      setCurrentPage(1);
  }

  return (
    <div className="space-y-6">
      {/* PANEL DE FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
        
        {/* BUSCADOR */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* FECHA */}
        <div className="relative w-full md:w-48">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="date"
            className="pl-9 bg-white"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* SELECTOR DE ESTADO */}
        <div className="relative w-full md:w-40">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
                className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
            </select>
        </div>

        {(searchTerm || dateFilter || statusFilter !== "all") && (
          <Button 
            variant="ghost" 
            onClick={clearFilters}
            className="text-slate-500 hover:text-red-600"
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Limpiar
          </Button>
        )}
      </div>

      {/* GRILLA DE EVENTOS (Igual) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedEvents.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl bg-slate-50">
            <p className="text-slate-500 font-medium">No se encontraron eventos coincidentes.</p>
          </div>
        ) : (
          paginatedEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 bg-white border-b border-slate-50">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-slate-800">{event.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 text-blue-600 font-medium">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {event.date ? new Date(event.date + 'T00:00:00').toLocaleDateString() : "Fecha no definida"}
                  </CardDescription>
                </div>
                <Badge variant={event.is_active ? "default" : "secondary"} className={event.is_active ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                  {event.is_active ? "Activo" : "Inactivo"}
                </Badge>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="space-y-2.5 mb-6 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Categoría:</span>
                    <Badge variant="outline" className="font-semibold text-slate-700 border-slate-300">
                      {event.event_type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Puntaje Máximo:</span>
                    <span className="font-bold text-slate-800">{event.max_score} pts</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button variant="outline" size="sm" asChild className="border-slate-300">
                    <Link href={`/admin/events/${event.id}/edit`}>Editar</Link>
                  </Button>
                  <Button variant="secondary" size="sm" asChild className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none">
                    <Link href={`/admin/events/${event.id}/judges`}>Jueces</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* CONTROLES DE PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-slate-100">
          <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-semibold text-slate-600">
            Página <span className="text-blue-600">{currentPage}</span> de {totalPages}
          </div>
          <Button variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}