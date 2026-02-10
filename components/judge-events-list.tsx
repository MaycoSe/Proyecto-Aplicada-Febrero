"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar as CalendarIcon, ClipboardList, AlertTriangle, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import Link from "next/link"
import type { Event } from "@/lib/types"

export function JudgeEventsList({ events }: { events: Event[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // --- LÓGICA DE FILTRADO ---
  const filteredEvents = events.filter((event) => {
    // 1. Filtro por Nombre
    const matchesName = event.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    // 2. Filtro por Fecha (asumiendo formato YYYY-MM-DD o ISO)
    const eventDate = event.date ? event.date.split('T')[0] : ""
    const matchesDate = !dateFilter || eventDate === dateFilter

    return matchesName && matchesDate
  })

  // --- PAGINACIÓN ---
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setDateFilter("")
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* --- BARRA DE HERRAMIENTAS (BUSCADOR) --- */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        
        {/* Input Buscador */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar evento por nombre..."
            className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* Input Fecha */}
        <div className="relative w-full md:w-48">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="date"
            className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* Botón Limpiar */}
        {(searchTerm || dateFilter) && (
          <Button variant="ghost" onClick={clearFilters} className="text-slate-500 hover:text-blue-600">
            <RotateCcw className="h-4 w-4 mr-2" /> Limpiar
          </Button>
        )}
      </div>

      {/* --- GRILLA DE EVENTOS --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedEvents.length === 0 ? (
           <div className="col-span-full py-16 text-center border-2 border-dashed rounded-xl bg-slate-50">
             <ClipboardList className="mx-auto h-12 w-12 text-slate-300 mb-3" />
             <p className="text-slate-500 font-medium">No se encontraron eventos con esos filtros.</p>
           </div>
        ) : (
          paginatedEvents.map((event) => (
            <Card key={event.id} className="flex flex-col hover:shadow-lg transition-all duration-200 border-slate-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant={event.event_type === "Camporee" ? "default" : "secondary"} className="mb-2">
                    {event.event_type || "General"}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-normal text-slate-600 border-slate-300">
                    {event.evaluation_type === "inspection" ? "Inspección" : "Estándar"}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-slate-800 leading-tight">{event.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {event.description || "Sin descripción disponible."}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="p-3 bg-slate-50 rounded-lg space-y-2 text-sm text-slate-600 border border-slate-100">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="flex items-center gap-2">
                        <CalendarIcon className="h-3.5 w-3.5 text-slate-400" /> Fecha:
                    </span>
                    <span className="font-medium text-slate-800">
                        {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Puntaje Máximo:</span>
                    <span className="font-bold text-blue-700">{event.max_score ?? 0} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peso en total:</span>
                    <span className="font-medium text-slate-800">{event.weight}%</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2 pt-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm" asChild>
                  <Link href={`/judge/score/${event.id}`}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Evaluar
                  </Link>
                </Button>
                <Button variant="outline" size="icon" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" asChild title="Aplicar Sanción">
                  <Link href={`/judge/sanction/${event.id}`}>
                    <AlertTriangle className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* --- PAGINACIÓN --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100">
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