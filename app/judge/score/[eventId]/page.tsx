import { requireJudge } from "@/lib/auth"
import { mockEvents } from "@/lib/mock-data"
import { ScoreForm } from "@/components/score-form"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// OJO: Definimos el tipo como una Promesa
interface PageProps {
  params: Promise<{
    eventId: string
  }>
}

export default async function ScorePage({ params }: PageProps) {
  // 1. Esperamos a que se resuelvan los parámetros
  const { eventId } = await params
  
  await requireJudge()
  
  // 2. Ahora usamos el ID resuelto
  const event = mockEvents.find((e) => e.id === eventId)

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
            Completá el formulario para registrar el puntaje del club.
        </p>
      </div>

      <ScoreForm event={event} />
    </div>
  )
}