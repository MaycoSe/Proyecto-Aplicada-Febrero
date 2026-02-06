"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { submitSanction } from "@/app/actions" // Importamos la acción real

interface SanctionFormProps {
  event: any
  clubs: any[] // Recibimos clubes reales
}

const sanctionTypes = [
  "Llegada Tardía",
  "Código de Vestimenta",
  "Conducta Antideportiva",
  "Violación de Seguridad",
  "Falta de Herramientas",
  "Otro",
]

export function SanctionForm({ event, clubs }: SanctionFormProps) {
  const router = useRouter()
  
  const [clubId, setClubId] = useState("")
  const [sanctionType, setSanctionType] = useState("")
  const [description, setDescription] = useState("")
  const [pointsDeducted, setPointsDeducted] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    // 1. Preparar FormData
    const formData = new FormData()
    formData.append("club_id", clubId)
    formData.append("points_deducted", pointsDeducted) // Nombre exacto de la columna en BD
    
    // Combinamos Tipo + Descripción porque la BD tiene un solo campo 'description'
    const fullDescription = `[${sanctionType}] ${description}`
    formData.append("description", fullDescription)

    try {
        // 2. Enviar al Servidor
        const result = await submitSanction(formData)

        if (!result.success) {
            setErrorMsg(result.message || "Error al guardar")
        } else {
            // Éxito: Volver atrás o refrescar
            router.refresh()
            router.back() 
        }
    } catch (err) {
        setErrorMsg("Error de conexión con el servidor")
    } finally {
        setLoading(false)
    }
  }

  return (
    <Card className="border-t-4 border-t-red-600 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          Detalles de la Sanción
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {errorMsg && (
             <Alert variant="destructive">
                <AlertDescription>{errorMsg}</AlertDescription>
             </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="club">Club a Sancionar *</Label>
            <Select value={clubId} onValueChange={setClubId} required disabled={loading}>
              <SelectTrigger id="club">
                <SelectValue placeholder="Seleccione un club..." />
              </SelectTrigger>
              <SelectContent>
                {clubs.map((club) => (
                    <SelectItem key={club.id} value={club.id.toString()}>
                      {club.name} ({club.code || 'S/C'})
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sanctionType">Motivo Principal *</Label>
            <Select value={sanctionType} onValueChange={setSanctionType} required disabled={loading}>
              <SelectTrigger id="sanctionType">
                <SelectValue placeholder="Seleccione el tipo de falta..." />
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
            <Label htmlFor="points" className="text-red-700 font-bold">Puntos a Descontar *</Label>
            <Input
              id="points"
              type="number"
              step="1"
              min="1"
              placeholder="Ej: 5"
              value={pointsDeducted}
              onChange={(e) => setPointsDeducted(e.target.value)}
              required
              disabled={loading}
              className="border-red-200 focus:ring-red-500 font-bold text-lg"
            />
            <p className="text-xs text-slate-500">Este valor se restará del total del club en el ranking general.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Observaciones / Detalles *</Label>
            <Textarea
              id="description"
              placeholder="Explique brevemente qué sucedió..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              disabled={loading}
            />
          </div>

          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 text-xs">
              Esta acción es irreversible por el juez. Afectará inmediatamente el ranking.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2 pt-2">
            <Button type="submit" variant="destructive" className="flex-1 font-bold" disabled={loading || !clubId}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Aplicando...</> : "Confirmar Sanción"}
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