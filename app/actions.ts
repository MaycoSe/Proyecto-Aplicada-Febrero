"use server"
// import { getAuthToken } from "@/lib/auth"
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

// app/actions.ts

export async function createEvent(prevState: any, formData: FormData) {
  const token = await getAuthToken()

  const rawData = {
    name: formData.get("name"),
    event_type: formData.get("eventType"),
    evaluation_type: formData.get("evaluationType"),
    description: formData.get("description"),
    max_score: Number(formData.get("maxScore")),
    weight: Number(formData.get("weight")),
    // Sincronizado con el input hidden "is_active" (1 o 0)
    is_active: formData.get("is_active") === "1",
    // NUEVO: Capturamos la fecha
    date: formData.get("date"), 
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
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const id = formData.get("id")

  if (!id) {
    return { success: false, message: "Error: No se encontró el ID del evento." }
  }

  const url = `${API_URL}/events/${id}`

  try {
      const res = await fetch(url, {
        method: "POST", // Laravel procesa esto como PUT gracias al hidden _method
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          // Nota: No poner Content-Type manual cuando enviamos FormData directamente
        },
        body: formData,
      })

      const responseText = await res.text()
      
      let data
      try {
          data = JSON.parse(responseText)
      } catch (e) {
          return { success: false, message: "Error de servidor (Respuesta no válida)" }
      }

      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Error al actualizar",
          errors: data.errors,
        }
      }

      revalidatePath("/admin/events") 
      
      return {
        success: true,
        message: "Evento actualizado correctamente",
        data: data,
      }

  } catch (error) {
      console.error("Error en updateEvent:", error)
      return { success: false, message: "Error de conexión con el servidor" }
  }
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

// app/actions.ts

// export async function submitScore(data: any) {
//   const token = await getAuthToken()

//   try {
//     const res = await fetch(`${API_URL}/scores`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//         "Accept": "application/json",
//       },
//       body: JSON.stringify({
//         event_id: data.eventId,
//         club_id: data.clubId,
//         score: data.totalScore,
//         details: data.details,
//         feedback: data.feedback
//       }),
//     })

//     const result = await res.json()

//     if (!res.ok) {
//       // AQUÍ ESTÁ LA CLAVE: Devolvemos 'message', no 'error'
//       return { success: false, message: result.message || "Error al guardar puntaje" }
//     }

//     revalidatePath("/ranking")
//     revalidatePath("/admin/reports")

//     return { success: true, message: "Evaluación registrada correctamente" }

//   } catch (error) {
//     console.error(error)
//     // En caso de fallo de red, devolvemos 'message'
//     return { success: false, message: "Error de conexión con el servidor" }
//   }
// }
// --- 3. FUNCIÓN PARA CREAR SANCIÓN ---
export async function submitSanction(formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  // Enviamos a la ruta de Laravel
  const res = await fetch(`${API_URL}/sanctions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      // SIN Content-Type para que funcione el FormData
    },
    body: formData,
  })

  const data = await res.json()

  if (!res.ok) {
    return {
      success: false,
      message: data.message || "Error al aplicar sanción",
      errors: data.errors
    }
  }

  return {
    success: true,
    message: "Sanción aplicada correctamente",
    data: data
  }
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

// app/actions.ts




// --- 1. FUNCIÓN PARA GUARDAR PUNTAJE (CORREGIDA) ---
export async function submitScore(formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  console.log("Enviando Score a:", `${API_URL}/scores`) // Debug

  const res = await fetch(`${API_URL}/scores`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      // ¡IMPORTANTE! NO AGREGAR "Content-Type".
      // Al omitirlo, el navegador configura automáticamente "multipart/form-data" con el boundary correcto.
    },
    body: formData,
  })

  const data = await res.json()

  if (!res.ok) {
    console.error("Error al guardar score:", data)
    return {
      success: false,
      message: data.message || "Error al guardar puntaje",
      errors: data.errors 
    }
  }

  return {
    success: true,
    message: "Puntaje guardado correctamente",
    data: data
  }
}

// --- 2. FUNCIÓN PARA ASIGNAR JUECES (CORREGIDA TAMBIÉN) ---
// La actualizamos para que use la misma lógica segura
// export async function assignJudges(prevState: any, formData: FormData) {
//   const cookieStore = await cookies()
//   const token = cookieStore.get("auth_token")?.value

//   // Extraemos el ID del evento del propio FormData para armar la URL
//   const eventId = formData.get("eventId") || formData.get("event_id")

//   const res = await fetch(`${API_URL}/events/${eventId}/judges`, {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${token}`,
//       "Accept": "application/json",
//       // Nuevamente: SIN Content-Type manual
//     },
//     body: formData,
//   })

//   const json = await res.json()

//   if (!res.ok) {
//     return { 
//         success: false, 
//         message: json.message || "Error al asignar jueces" 
//     }
//   }

//   return { 
//     success: true, 
//     message: "Jueces asignados correctamente" 
//   }
// }