import { requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockUsers } from "@/lib/mock-data"
import { UserActionsMenu } from "@/components/user-actions-menu" // <--- IMPORTAMOS EL NUEVO COMPONENTE
import { Plus, UserCog, Shield, Mail } from "lucide-react"
import Link from "next/link"

export default async function UsersPage() {
  await requireAdmin()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">Usuarios y Accesos</h1>
          <p className="mt-1 text-slate-600">Administra jueces, directores y permisos del sistema.</p>
        </div>
        
        {/* BOTÓN NUEVO USUARIO (Asegúrate de que la carpeta /new existe) */}
        <Link href="/admin/users/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </Link>
      </div>

      <Card className="border-t-4 border-t-blue-600 shadow-md">
        <CardHeader>
          <CardTitle>Listado de Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold text-slate-700">Usuario</TableHead>
                <TableHead className="font-bold text-slate-700">Rol</TableHead>
                <TableHead className="font-bold text-slate-700">Estado</TableHead>
                <TableHead className="font-bold text-slate-700 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-full text-slate-600">
                        {user.role === 'admin' ? <Shield className="h-4 w-4" /> : <UserCog className="h-4 w-4" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{user.fullName}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize font-medium ${
                        user.role === 'admin' 
                            ? 'bg-purple-50 text-purple-700 border-purple-200' 
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Juez / Evaluador'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-500"}>
                      {user.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  
                  {/* AQUÍ ESTÁ EL MENÚ FUNCIONAL */}
                  <TableCell className="text-right">
                    <UserActionsMenu user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}