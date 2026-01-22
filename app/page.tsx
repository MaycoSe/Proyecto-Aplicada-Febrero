import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const user = await getCurrentUser()

  // Redirect based on authentication status
  if (user) {
    if (user.role === "admin") {
      redirect("/admin")
    } else {
      redirect("/judge")
    }
  } else {
    redirect("/login")
  }
}
