// lib/api.ts
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Helper para obtener headers con el token
async function getHeaders() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  }
}

// Helper genérico para GET
export async function fetchAPI(endpoint: string) {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}${endpoint}`, { 
    headers, 
    cache: 'no-store' // Para que siempre traiga datos frescos
  })
  
  if (res.status === 401) redirect("/login") // Si el token expiró, sacar al usuario
  if (!res.ok) throw new Error(`Error fetching ${endpoint}`)
  
  return res.json()
}

// Funciones específicas para tus datos
export async function getClubs() {
  // Laravel devuelve un array directo en index() según tu ClubController
  return fetchAPI("/clubs")
}

export async function getClubById(id: string) {
  return fetchAPI(`/clubs/${id}`)
}

export async function getEvents() {
  return fetchAPI("/events")
}

export async function getJudges() {
  const data = await fetchAPI("/jueces?limit=100")
  return data.users.data // Según tu UserController::get_jueces devuelve { users: { data: [...] } }
}

// En lib/api.ts

export async function getAllUsers() {
  const data = await fetchAPI("/users?limit=100") // Traemos usuarios
  return data.users.data // Laravel retorna { users: { data: [...] } } al paginar
}

export async function getEventById(id: string) {
  // Laravel devuelve el objeto directo si usas Route binding, o {data: event}
  // Ajusta según tu controlador. Generalmente es directo.
  return fetchAPI(`/events/${id}`)
}


export async function getClubStats(clubId: string) {
  return fetchAPI(`/clubs/${clubId}/stats`)
}