import { requireJudge } from "@/lib/auth"
import { getEventById, getActiveClubs } from "@/lib/api"
import { ScoreForm } from "@/components/score-form"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ eventId: string }> // Coincide con la carpeta [eventId]
}

export default async function ScorePage({ params }: PageProps) {
  // 1. Extraemos 'eventId' (porque así se llama la carpeta)
  const { eventId } = await params
  
  await requireJudge()
  
  // 2. Usamos esa variable para buscar los datos
  const [event, clubs] = await Promise.all([
    getEventById(eventId),
    getActiveClubs()
  ])

  if (!event) {
    notFound()
  }

  return (
    <div className="container max-w-2xl py-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2">
        <Link href="/judge">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="mr-1 h-4 w-4" /> Volver
            </Button>
        </Link>
      </div>
      
      <div className="space-y-1 px-1">
        <h1 className="text-2xl font-bold text-blue-900">Nueva Evaluación</h1>
        <p className="text-slate-600">
            Completá el formulario para registrar el puntaje del club en <strong>{event.name}</strong>.
        </p>
      </div>

      {/* 3. CORRECCIÓN FINAL: Pasamos la variable correcta 'eventId' */}
      <ScoreForm 
        event={event} 
        clubs={clubs} 
        eventId={eventId} 
      />
    </div>
  )
}