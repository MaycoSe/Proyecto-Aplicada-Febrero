"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, KeyRound, Mail } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await login(email, password)

      if (result.success && result.user) {
        // Redirección basada en el rol
        if (result.user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/judge")
        }
      } else {
        setError(result.error || "Credenciales inválidas")
        setIsLoading(false)
      }
    } catch (err) {
      setError("Ocurrió un error inesperado. Intente nuevamente.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-t-4 border-t-blue-600">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
                <KeyRound className="h-8 w-8 text-blue-600" />
            </div>
        </div>
        <CardTitle className="text-2xl font-bold text-blue-900">Iniciar Sesión</CardTitle>
        <CardDescription>
          Sistema de Gestión Camporee 2026
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="usuario@camporee.com" 
                    className="pl-10"
                    required 
                />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
            </div>
            <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10"
                    required 
                />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Ingresar al Sistema"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t bg-slate-50/50 pt-4">
        {/* <div className="text-center text-xs text-slate-500">
            <p>Credenciales de prueba:</p>
            <p>Admin: <span className="font-mono text-blue-600">admin@camp.com</span> / <span className="font-mono">admin123</span></p>
            <p>Juez: <span className="font-mono text-blue-600">judge1@camp.com</span> / <span className="font-mono">judge123</span></p>
        </div> */}
      </CardFooter>
    </Card>
  )
}