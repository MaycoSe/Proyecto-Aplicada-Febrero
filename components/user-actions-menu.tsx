"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Lock, KeyRound, CheckCircle, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { resetPassword, toggleUserStatus } from "@/app/actions"
import type { User } from "@/lib/types"

export function UserActionsMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleResetPassword = async () => {
    if (confirm(`¿Estás seguro de restablecer la contraseña de ${user.fullName}?`)) {
        await resetPassword(user.id)
        alert("Contraseña restablecida temporalmente a: camp2026")
        setIsOpen(false)
    }
  }

  const handleToggleStatus = async () => {
    const action = user.isActive ? "desactivar" : "activar"
    if (confirm(`¿Deseas ${action} el acceso a ${user.fullName}?`)) {
        await toggleUserStatus(user.id, !user.isActive)
        setIsOpen(false)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
        
        {/* EDITAR - Usa Link para navegar */}
        <DropdownMenuItem asChild>
          <Link href={`/admin/users/${user.id}/edit`} className="cursor-pointer flex items-center w-full">
             <Edit className="mr-2 h-4 w-4 text-blue-600" /> Editar datos
          </Link>
        </DropdownMenuItem>

        {/* RESTABLECER - Botón interactivo */}
        <DropdownMenuItem onClick={handleResetPassword} className="cursor-pointer">
            <KeyRound className="mr-2 h-4 w-4 text-orange-600" /> Restablecer Clave
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        {/* ACTIVAR / DESACTIVAR - Botón interactivo */}
        <DropdownMenuItem onClick={handleToggleStatus} className={`cursor-pointer ${user.isActive ? "text-red-600 focus:text-red-700" : "text-green-600 focus:text-green-700"}`}>
             {user.isActive ? (
                <>
                    <Lock className="mr-2 h-4 w-4" /> Desactivar Acceso
                </>
             ) : (
                <>
                    <CheckCircle className="mr-2 h-4 w-4" /> Reactivar Acceso
                </>
             )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}