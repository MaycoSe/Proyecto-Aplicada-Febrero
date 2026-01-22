"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation" // <--- Importante: Agregamos redirect
import type { User } from "./types"
import { mockUsers } from "./mock-data"

const SESSION_COOKIE = "camp_session"

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Verificación simulada (mock)
  const user = mockUsers.find((u) => u.email === email && u.isActive)

  if (!user) {
    return { success: false, error: "Credenciales inválidas" }
  }

  // Contraseñas de demostración
  if (password !== "admin123" && password !== "judge123") {
    return { success: false, error: "Contraseña incorrecta" }
  }

  // Crear sesión
  const sessionData = JSON.stringify({ userId: user.id, role: user.role })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })

  return { success: true, user }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)

  if (!session) {
    return null
  }

  try {
    const { userId } = JSON.parse(session.value)
    const user = mockUsers.find((u) => u.id === userId)
    return user || null
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login") // <--- Redirige en lugar de lanzar error
  }
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== "admin") {
    // Si está logueado pero no es admin, lo mandamos al login o inicio
    redirect("/login") 
  }
  return user
}

// --- ESTA ES LA FUNCIÓN QUE TE FALTABA ---
export async function requireJudge(): Promise<User> {
  const user = await requireAuth()
  // Permitimos el acceso si es Juez O si es Admin
  if (user.role !== "judge" && user.role !== "admin") {
    redirect("/login")
  }
  return user
}