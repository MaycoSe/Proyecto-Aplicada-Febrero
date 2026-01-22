import { requireAdmin } from "@/lib/auth"
import { EventForm } from "@/components/event-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewEventPage() {
  await requireAdmin()

  return (
    <div className="container max-w-3xl py-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2">
        <Link href="/admin/events">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="mr-1 h-4 w-4" /> Volver a la lista
            </Button>
        </Link>
      </div>
      
      <div className="px-1">
         <h1 className="text-3xl font-bold text-blue-950">Crear Evento</h1>
         <p className="text-slate-600">
            Define las reglas y parámetros de una nueva actividad.
         </p>
      </div>

      <EventForm />
    </div>
  )
}