import { requireAuth } from "@/lib/auth"
import { mockEvents } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { SanctionForm } from "@/components/sanction-form"

export default async function SanctionPage({ params }: { params: Promise<{ eventId: string }> }) {
  await requireAuth()
  const { eventId } = await params
  const event = mockEvents.find((e) => e.id === eventId)

  if (!event) {
    notFound()
  }

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add Sanction</h1>
        <p className="mt-1 text-slate-600">{event.name}</p>
      </div>

      <SanctionForm event={event} />
    </div>
  )
}
