import { getCurrentUser } from "@/lib/auth"
import { LogoutButton } from "./logout-button"

export async function JudgeHeader() {
  const user = await getCurrentUser()

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Judge Portal</h1>
          <p className="text-xs text-slate-600">{user?.fullName}</p>
        </div>
        <LogoutButton />
      </div>
    </header>
  )
}
