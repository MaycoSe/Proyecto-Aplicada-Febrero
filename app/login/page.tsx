import { LoginForm } from "@/components/login-form"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const user = await getCurrentUser()

  // Redirect if already logged in
  if (user) {
    if (user.role === "admin") {
      redirect("/admin")
    } else {
      redirect("/judge")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Camp Score</h1>
          <p className="mt-2 text-slate-600">Management System</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
