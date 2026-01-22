import { requireJudge } from "@/lib/auth"
import { mockEvents } from "@/lib/mock-data"
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
  // 1. Await params
  const { eventId } = await params
  
  await requireJudge()
  const event = mockEvents.find((e) => e.id === eventId)

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

      <div className="space-y-1 px-1 border-l-4 border-red-500 pl-4">
        <h1 className="text-2xl font-bold text-red-700">Aplicar Sanción</h1>
        <p className="text-slate-600">
            Estás por descontar puntos en el evento <span className="font-semibold text-slate-900">{event.name}</span>.
        </p>
      </div>

      <SanctionForm event={event} />
    </div>
  )
}