import { requireAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockEvents } from "@/lib/mock-data"
import { Calendar, Plus, AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function JudgeDashboard() {
  const user = await requireAuth()

  // In production, filter events assigned to this judge
  const assignedEvents = mockEvents.filter((e) => e.isActive)

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Events</h1>
        <p className="mt-1 text-slate-600">Select an event to record scores or sanctions</p>
      </div>

      {assignedEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No Events Assigned</h3>
            <p className="mt-2 text-center text-sm text-slate-600">
              You don't have any events assigned yet. Contact an administrator for access.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignedEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <div className="flex-1">
                    <CardTitle>{event.name}</CardTitle>
                    <p className="text-sm text-slate-600">{event.eventType}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link href={`/judge/score/${event.id}`} className="flex-1">
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Record Score
                    </Button>
                  </Link>
                  <Link href={`/judge/sanction/${event.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Add Sanction
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
