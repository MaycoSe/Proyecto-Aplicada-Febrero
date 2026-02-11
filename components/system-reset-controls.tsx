"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { resetSystemData } from "@/app/actions"
import { toast } from "sonner" // O usa window.alert si no tienes toast

export function SystemResetControls() {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleReset = async (type: 'scores' | 'sanctions') => {
    setIsDeleting(type)
    
    const result = await resetSystemData(type)
    
    if (result.success) {
      // Si usas sonner/toast: toast.success(result.message)
      alert(result.message) 
    } else {
      alert(result.message)
    }
    
    setIsDeleting(null)
  }

  return (
    <Card className="border-red-200 shadow-sm bg-red-50/30 mt-8">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <CardTitle className="text-lg">Zona de Peligro</CardTitle>
        </div>
        <CardDescription>
          Estas acciones son irreversibles. Borrarán los datos de la base de datos permanentemente.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
        
        {/* BOTÓN BORRAR PUNTAJES */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={!!isDeleting} className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
              {isDeleting === 'scores' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Eliminar Todos los Puntajes
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará <b>TODOS</b> los puntajes registrados de todos los clubes. 
                El ranking volverá a cero. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleReset('scores')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sí, eliminar puntajes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* BOTÓN BORRAR SANCIONES */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={!!isDeleting} className="w-full sm:w-auto border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800">
              {isDeleting === 'sanctions' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Eliminar Todas las Sanciones
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Borrar historial de sanciones?</AlertDialogTitle>
              <AlertDialogDescription>
                Se eliminarán todas las sanciones aplicadas a los clubes. 
                Los puntos descontados se perderán.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleReset('sanctions')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Sí, eliminar sanciones
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </CardContent>
    </Card>
  )
}