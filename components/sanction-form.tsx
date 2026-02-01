"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockClubs } from "@/lib/mock-data"
import type { Event } from "@/lib/types"
import { CheckCircle, AlertTriangle } from "lucide-react"

interface SanctionFormProps {
  event: Event
}

const sanctionTypes = [
  "Late Arrival",
  "Dress Code Violation",
  "Unsportsmanlike Conduct",
  "Safety Violation",
  "Equipment Violation",
  "Other",
]

export function SanctionForm({ event }: SanctionFormProps) {
  const router = useRouter()
  const [clubId, setClubId] = useState("")
  const [sanctionType, setSanctionType] = useState("")
  const [description, setDescription] = useState("")
  const [pointsDeducted, setPointsDeducted] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Sanction submitted:", {
      clubId,
      eventId: event.id,
      sanctionType,
      description,
      pointsDeducted: Number.parseFloat(pointsDeducted),
    })

    setSuccess(true)
    setLoading(false)

    // Reset form after 2 seconds
    setTimeout(() => {
      setClubId("")
      setSanctionType("")
      setDescription("")
      setPointsDeducted("")
      setSuccess(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Detalles de la sanción
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">¡Sanción registrada exitosamente!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="club">Club afectado *</Label>
            <Select value={clubId} onValueChange={setClubId} required disabled={loading}>
              <SelectTrigger id="club">
                <SelectValue placeholder="Choose a club" />
              </SelectTrigger>
              <SelectContent>
                {mockClubs
                  .filter((c) => c.isActive)
                  .map((club) => (
                    <SelectItem key={club.id} value={club.id}>
                      {club.name} ({club.code})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sanctionType">Tipo de sanción *</Label>
            <Select value={sanctionType} onValueChange={setSanctionType} required disabled={loading}>
              <SelectTrigger id="sanctionType">
                <SelectValue placeholder="Select sanction type" />
              </SelectTrigger>
              <SelectContent>
                {sanctionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Puntos deducidos *</Label>
            <Input
              id="points"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter points to deduct"
              value={pointsDeducted}
              onChange={(e) => setPointsDeducted(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed explanation of the sanction..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              disabled={loading}
            />
          </div>

          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Las sanciones son permanentes y afectarán el marcador final del club. Por favor, asegúrese de que toda la información sea correcta.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button type="submit" variant="destructive" className="flex-1" disabled={loading}>
              {loading ? "Submitting..." : "Apply Sanction"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
