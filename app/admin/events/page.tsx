import { requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockEvents } from "@/lib/mock-data"
import { Plus, Calendar } from "lucide-react"

export default async function EventsPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Events</h1>
          <p className="mt-1 text-slate-600">Manage competition events</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="space-y-4">
        {mockEvents.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle>{event.name}</CardTitle>
                    <p className="text-sm text-slate-600">{event.eventType}</p>
                  </div>
                </div>
                <Badge variant={event.isActive ? "default" : "secondary"}>
                  {event.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-600">Max Score</p>
                  <p className="text-lg font-semibold text-slate-900">{event.maxScore}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Weight</p>
                  <p className="text-lg font-semibold text-slate-900">{event.weight}x</p>
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Assign Judges
                  </Button>
                </div>
              </div>
              {event.description && <p className="mt-4 text-sm text-slate-600">{event.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
