export const dynamic = 'force-dynamic'; // <--- AGREGÁ ESTO
import { requireJudge } from "@/lib/auth"
import { getEventById, getActiveClubs } from "@/lib/api" // Usamos la API real
import { SanctionForm } from "@/components/sanction-form"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    eventId: string
  }>
}

export default async function SanctionPage({ params }: PageProps) {
  const { eventId } = await params
  
  await requireJudge()
  
  // Fetch datos reales en paralelo
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
                <ArrowLeft className="mr-1 h-4 w-4" /> Cancelar y Volver
            </Button>
        </Link>
      </div>

      <div className="space-y-1 px-1 border-l-4 border-red-500 pl-4 bg-red-50 py-4 rounded-r-lg">
        <h1 className="text-2xl font-bold text-red-700">Aplicar Sanción</h1>
        <p className="text-slate-700">
            Estás reportando una infracción durante el evento: <br/>
            <span className="font-bold text-xl">{event.name}</span>
        </p>
      </div>

      {/* Pasamos los datos reales al formulario */}
      <SanctionForm event={event} clubs={clubs} />
    </div>
  )
}