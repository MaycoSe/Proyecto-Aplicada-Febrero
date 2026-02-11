import { requireAdmin } from "@/lib/auth"
import { UserForm } from "@/components/user-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewUserPage() {
  await requireAdmin()

  return (
    <div className="container max-w-3xl py-6 space-y-6 animate-in slide-in-from-right-4">
      <div className="flex items-center gap-2">
        <Link href="/admin/users">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="mr-1 h-4 w-4" /> Volver a la lista
            </Button>
        </Link>
      </div>
      
      <div className="px-1">
         <h1 className="text-3xl font-bold text-blue-950">Registrar Personal</h1>
         <p className="text-slate-600">
            Da de alta un nuevo juez o administrador en el sistema.
         </p>
      </div>

      <UserForm />
    </div>
  )
}