"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { User, UserRole } from "./types"

const TOKEN_COOKIE = "auth_token"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

function mapRole(laravelRole: string): UserRole {
  const role = laravelRole ? laravelRole.toLowerCase().trim() : "judge";
  if (role === 'admin' || role === 'administrador') return 'admin';
  return 'judge'; 
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { 
        success: false, 
        error: data.message || data.email?.[0] || "Credenciales inválidas" 
      }
    }

    const userRole = mapRole(data.role);

    const userData: User = {
      id: data.user.id.toString(),
      email: data.user.email,
      fullName: `${data.user.name} ${data.user.last_name || ''}`.trim(),
      role: userRole,
      // --- AGREGA ESTO ---
      role_id: data.user.role_id, // Laravel lo envía por defecto en el objeto user
      // -------------------
      isActive: true,
      createdAt: data.user.created_at || new Date().toISOString(),
      updatedAt: data.user.updated_at || new Date().toISOString(),
    }

    const cookieStore = await cookies()
    cookieStore.set(TOKEN_COOKIE, data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return { success: true, user: userData }

  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Error de conexión con el servidor" }
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE)?.value

  if (token) {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      })
    } catch (e) {
      // Ignorar error
    }
  }
  
  cookieStore.delete(TOKEN_COOKIE)
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE)?.value

  if (!token) return null

  try {
    const response = await fetch(`${API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) return null

    const data = await response.json()
    
    return {
        id: data.id.toString(),
        email: data.email,
        fullName: `${data.name} ${data.last_name || ''}`.trim(),
        role: mapRole(data.role),
        // --- AGREGA ESTO ---
        role_id: data.role_id, // <--- NECESARIO QUE EL BACKEND LO ENVÍE
        // -------------------
        isActive: true,
        createdAt: data.created_at,
        updatedAt: data.updated_at
    }
  } catch (e) {
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== "admin") {
    redirect("/login") 
  }
  return user
}

export async function requireJudge(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== "judge" && user.role !== "admin") {
    redirect("/login")
  }
  return user
}

export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_COOKIE)?.value
}