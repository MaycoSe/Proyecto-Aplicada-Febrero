import { requireAdmin } from "@/lib/auth"
import { EventForm } from "@/components/event-form"
import { getEventById } from "@/lib/api" // <--- CAMBIO IMPORTANTE: Importamos la API real
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditEventPage({ params }: PageProps) {
  // 1. Verificar permisos
  await requireAdmin()
  
  // 2. Resolver parámetros (Next.js 15/16)
  const { id } = await params 

  // 3. Buscar el evento REAL en la base de datos
  // Usamos .catch(() => null) para evitar que explote si la API da error
  const event = await getEventById(id).catch(() => null)

  // 4. Si no existe en la BD, mostrar 404
  if (!event) {
    notFound()
  }

  return (
    <div className="container max-w-3xl py-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2">
        <Link href="/admin/events">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="mr-1 h-4 w-4" /> Cancelar y Volver
            </Button>
        </Link>
      </div>
      
      <div className="px-1 border-l-4 border-orange-500 pl-4">
         <h1 className="text-3xl font-bold text-orange-800">Editar Evento</h1>
         <p className="text-slate-600">
            Modifica los parámetros de <strong>{event.name}</strong>.
         </p>
      </div>

      {/* Pasamos el evento real al formulario */}
      <EventForm event={event} />
    </div>
  )
}