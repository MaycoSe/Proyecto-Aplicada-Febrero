"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Helper privado para obtener token en Server Actions
async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get("auth_token")?.value
}

// ==========================================
// ACCIONES DE CLUBES
// ==========================================

export async function createClub(prevState: any, formData: FormData) {
  const token = await getAuthToken()
  
  const rawData = {
    name: formData.get("name"),
    code: formData.get("code"),
    description: formData.get("description"),
    // CAMBIO AQUÍ: 'is_active' para coincidir con la base de datos
    is_active: formData.get("isActive") === "on",
  }

  const response = await fetch(`${API_URL}/clubs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(rawData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    return { success: false, message: errorData.message || "Error al crear el club" }
  }

  revalidatePath("/admin/clubs")
  // En Server Actions con useActionState, el redirect debe hacerse con cuidado o retornar éxito para que el cliente redirija
  return { success: true, message: "Club creado exitosamente" }
}

export async function updateClub(prevState: any, formData: FormData) {
  const token = await getAuthToken()
  const id = formData.get("id") // Obtenemos el ID del formulario

  const rawData = {
    name: formData.get("name"),
    code: formData.get("code"),
    description: formData.get("description"),
    // CAMBIO AQUÍ: 'is_active' para coincidir con la base de datos
    is_active: formData.get("isActive") === "on", 
  }

  const response = await fetch(`${API_URL}/clubs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(rawData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    return { success: false, message: errorData.message || "Error al actualizar el club" }
  }

  revalidatePath("/admin/clubs")
  return { success: true, message: "Club actualizado correctamente" }
}

export async function deleteClub(id: string) {
  const token = await getAuthToken()

  const response = await fetch(`${API_URL}/clubs/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    return { success: false, error: "Error al eliminar el club" }
  }

  revalidatePath("/admin/clubs")
  return { success: true }
}

// ==========================================
// ACCIONES DE EVENTOS
// ==========================================

export async function createEvent(prevState: any, formData: FormData) {
  const token = await getAuthToken()

  const rawData = {
    name: formData.get("name"),
    event_type: formData.get("eventType"),
    evaluation_type: formData.get("evaluationType"),
    description: formData.get("description"),
    max_score: Number(formData.get("maxScore")),
    weight: Number(formData.get("weight")),
    is_active: formData.get("isActive") === "on",
  }

  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(rawData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error("Error creating event:", errorData)
    return { success: false, message: errorData.message || "Error al crear el evento" }
  }

  revalidatePath("/admin/events")
  return { success: true, message: "Evento creado exitosamente" }
}

export async function updateEvent(prevState: any, formData: FormData) {
  const token = await getAuthToken()
  const id = formData.get("id")

  const rawData = {
    name: formData.get("name"),
    event_type: formData.get("eventType"),
    evaluation_type: formData.get("evaluationType"),
    description: formData.get("description"),
    max_score: Number(formData.get("maxScore")),
    weight: Number(formData.get("weight")),
    is_active: formData.get("isActive") === "on",
  }

  const response = await fetch(`${API_URL}/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(rawData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    return { success: false, message: errorData.message || "Error al actualizar el evento" }
  }

  revalidatePath("/admin/events")
  return { success: true, message: "Evento actualizado correctamente" }
}

export async function deleteEvent(id: string) {
  const token = await getAuthToken()

  const response = await fetch(`${API_URL}/events/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    return { success: false, error: "Error al eliminar el evento" }
  }

  revalidatePath("/admin/events")
  return { success: true }
}

// ==========================================
// ACCIONES DE USUARIOS
// ==========================================

export async function createUser(prevState: any, formData: FormData) {
  const token = await getAuthToken()
  
  const roleValue = formData.get("role")
  const role_id = roleValue === "admin" ? 1 : 2 

  const rawData = {
    name: formData.get("fullName"), // Asegúrate que tu form use estos names
    // last_name: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password") || "12345678", // Default temporal si no envían
    role_id: formData.get("role_id") ,
    // role_id: role_id,
  }

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(rawData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    return { success: false, message: errorData.message || "Error al crear usuario" }
  }
  if (!response.ok) {
      const text = await response.text();
      console.log("🔥 ERROR DEL BACKEND:", response.status, text); // <--- MIRA TU TERMINAL
      return { success: false, message: "Error: " + text };
  }

  revalidatePath("/admin/users")
  return { success: true, message: "Usuario creado correctamente" }
}

export async function updateUser(prevState: any, formData: FormData) {
  const token = await getAuthToken()
  const id = formData.get("id")

  const rawData: any = {
    name: formData.get("fullName"),
    // last_name: formData.get("lastName"),
    email: formData.get("email"),
    role_id: formData.get("role_id"), // Laravel lo necesita sí o sí
    is_active: formData.get("isActive"),
    
  }

  const password = formData.get("password")
  if (password && password.toString().trim() !== "") {
    rawData.password = password
  }

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(rawData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    return { success: false, message: errorData.message || "Error al actualizar usuario" }
  }

  revalidatePath("/admin/users")
  return { success: true, message: "Usuario actualizado correctamente" }
}

export async function deleteUser(id: string) {
  const token = await getAuthToken()

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    return { success: false, error: "Error al eliminar usuario" }
  }

  revalidatePath("/admin/users")
  return { success: true }
}

// ==========================================
// ACCIONES DE PUNTAJES Y SANCIONES
// ==========================================

export async function submitScore(data: any) {
  // Nota: submitScore generalmente se llama desde un handler onSubmit cliente, no desde form action directo.
  // Si usas useActionState aquí también, deberías cambiar la firma a (prevState, formData).
  // Pero según tu componente score-form.tsx (visto en historial), usas fetch cliente o un action simple.
  // Mantendremos la versión simple si la llamas manualmente.
  
  const token = await getAuthToken()
  
  const payload = {
    event_id: data.eventId,
    club_id: data.clubId,
    total_score: data.totalScore,
    details: data.details,
    feedback: data.feedback
  }

  const response = await fetch(`${API_URL}/scores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    return { success: false, error: errorData.message || "Error al guardar puntaje" }
  }

  revalidatePath("/judge")
  return { success: true }
}

export async function submitSanction(prevState: any, formData: FormData) {
  const token = await getAuthToken()

  const rawData = {
    event_id: formData.get("eventId"),
    club_id: formData.get("clubId"),
    description: formData.get("description"),
    points_deducted: Number(formData.get("pointsDeducted")),
    sanction_type: "Disciplinary" // Valor por defecto
  }

  const response = await fetch(`${API_URL}/sanctions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(rawData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    return { success: false, message: errorData.message || "Error al crear sanción" }
  }

  revalidatePath("/judge")
  return { success: true, message: "Sanción aplicada correctamente" }
}

// app/actions.ts

// ... (tus otras importaciones)

// ==========================================
// ACCIÓN DE ASIGNAR JUECES (Adaptada a FormData)
// ==========================================

export async function assignJudges(prevState: any, formData: FormData) {
  const token = await getAuthToken()
  const eventId = formData.get("eventId")
  
  // formData.getAll recupera todos los valores de los checkboxes marcados con name="judges"
  const judgeIds = formData.getAll("judges") 

  const response = await fetch(`${API_URL}/events/${eventId}/judges`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ judges: judgeIds }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    return { success: false, message: errorData.message || "Error al asignar jueces" }
  }

  revalidatePath(`/admin/events/${eventId}/judges`)
  revalidatePath(`/admin/events`)
  
  return { success: true, message: "Jueces asignados correctamente. Redirigiendo..." }
}