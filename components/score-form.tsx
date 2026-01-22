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
import { CheckCircle } from "lucide-react"

interface ScoreFormProps {
  event: Event
}

export function ScoreForm({ event }: ScoreFormProps) {
  const router = useRouter()
  const [clubId, setClubId] = useState("")
  const [score, setScore] = useState("")
  const [creativityScore, setCreativityScore] = useState("")
  const [executionScore, setExecutionScore] = useState("")
  const [presentationScore, setPresentationScore] = useState("")
  const [notes, setNotes] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Score submitted:", {
      clubId,
      eventId: event.id,
      score: Number.parseFloat(score),
      creativityScore: creativityScore ? Number.parseFloat(creativityScore) : undefined,
      executionScore: executionScore ? Number.parseFloat(executionScore) : undefined,
      presentationScore: presentationScore ? Number.parseFloat(presentationScore) : undefined,
      notes,
    })

    setSuccess(true)
    setLoading(false)

    // Reset form after 2 seconds
    setTimeout(() => {
      setClubId("")
      setScore("")
      setCreativityScore("")
      setExecutionScore("")
      setPresentationScore("")
      setNotes("")
      setSuccess(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">Score recorded successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="club">Select Club *</Label>
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
            <Label htmlFor="score">Overall Score * (Max: {event.maxScore})</Label>
            <Input
              id="score"
              type="number"
              step="0.01"
              min="0"
              max={event.maxScore}
              placeholder="Enter score"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="creativity">Creativity Score</Label>
              <Input
                id="creativity"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0-100"
                value={creativityScore}
                onChange={(e) => setCreativityScore(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="execution">Execution Score</Label>
              <Input
                id="execution"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0-100"
                value={executionScore}
                onChange={(e) => setExecutionScore(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presentation">Presentation Score</Label>
              <Input
                id="presentation"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0-100"
                value={presentationScore}
                onChange={(e) => setPresentationScore(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional comments or observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Submitting..." : "Submit Score"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
