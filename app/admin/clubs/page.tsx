import { requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockClubs } from "@/lib/mock-data"
import { Plus, Trophy } from "lucide-react"

export default async function ClubsPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clubs</h1>
          <p className="mt-1 text-slate-600">Manage competing clubs</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Club
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockClubs.map((club) => (
          <Card key={club.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Trophy className="h-8 w-8 text-blue-600" />
                <Badge variant={club.isActive ? "default" : "secondary"}>{club.isActive ? "Active" : "Inactive"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{club.name}</h3>
                <p className="text-sm font-medium text-slate-500">Code: {club.code}</p>
              </div>
              {club.description && <p className="text-sm text-slate-600">{club.description}</p>}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View Scores
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
