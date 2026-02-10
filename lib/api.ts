// lib/api.ts
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAuthToken } from "@/lib/auth"

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
// export async function fetchAPI(endpoint: string) {
//   const headers = await getHeaders()
//   const res = await fetch(`${API_URL}${endpoint}`, { 
//     headers, 
//     cache: 'no-store' // Para que siempre traiga datos frescos
//   })
  
//   if (res.status === 401) redirect("/login") // Si el token expiró, sacar al usuario
//   if (!res.ok) throw new Error(`Error fetching ${endpoint}`)
  
//   return res.json()
// }


export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  let shouldRedirect = false;
  let resultData = null;

  // Preparamos los headers para que no tengas que enviarlos siempre en el form
  const headers = {
    "Accept": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    // CORRECCIÓN AQUÍ: 
    // fetch(url, init) -> No uses ... dentro de los paréntesis de la llamada
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      shouldRedirect = true;
    } else {
      // Si la respuesta es 204 No Content, no intentamos parsear JSON
      if (res.status !== 204) {
        resultData = await res.json();
      }
      
      // Si la respuesta no es OK (400, 500, etc), lanzamos o manejamos el error
      if (!res.ok) {
          return { 
              success: false, 
              message: resultData?.message || "Error en la petición",
              errors: resultData?.errors 
          };
      }

      return resultData;
    }
  } catch (error) {
    console.error("Error en fetchAPI:", error);
    throw error;
  }

  // La redirección SIEMPRE fuera del try/catch
  if (shouldRedirect) {
    redirect("/login");
  }
}






// --- Funciones específicas ---

export async function getClubs() {
  return fetchAPI("/clubs")
}

export async function getClubById(id: string) {
  return fetchAPI(`/clubs/${id}`)
}

export async function getEvents() {
  return fetchAPI("/events")
}

// export async function getJudges() {
//   const data = await fetchAPI("/jueces?limit=100")
//   return data.users.data 
// }

// export async function getAllUsers() {
//   const data = await fetchAPI("/users?limit=100") 
//   return data.users.data 
// }

// En lib/api.ts

// Función auxiliar para extraer el array de usuarios venga como venga
function extractData(response: any) {
  if (Array.isArray(response)) return response; // Es un array directo
  if (response.data && Array.isArray(response.data)) return response.data; // Es paginación standard
  if (response.users && Array.isArray(response.users)) return response.users; // Formato personalizado
  if (response.users && response.users.data) return response.users.data; // Paginación anidada
  return []; // No encontramos nada
}

// Actualiza esta función
export async function getJudges() {
  try {
    const data = await fetchAPI("/jueces") // Llamamos al endpoint específico de jueces
    return extractData(data)
  } catch (e) {
    console.error("Error fetching judges:", e)
    return []
  }
}

// Actualiza esta también
export async function getAllUsers() {
  try {
    const data = await fetchAPI("/users")
    return extractData(data)
  } catch (e) {
    console.error("Error fetching users:", e)
    return []
  }
}





export async function getClubStats(clubId: string) {
  return fetchAPI(`/clubs/${clubId}/stats`)
}

// --- AQUÍ ESTÁN LAS CORRECCIONES ---
// Ahora usan headers con token para pasar la seguridad de Laravel

export async function getEventById(id: string) {
  // 1. Obtenemos headers con token
  const headers = await getHeaders() 
  
  const res = await fetch(`${API_URL}/events/${id}`, { 
    headers, // <--- Importante: Enviar credenciales
    cache: "no-store" 
  })

  // Si da 401 (No autorizado) o 404, devolvemos null para que la página maneje el error
  if (!res.ok) return null
  
  return await res.json()
}

export async function getActiveClubs() {
  // 1. Obtenemos headers con token
  const headers = await getHeaders()

  const res = await fetch(`${API_URL}/clubs`, { 
    headers, // <--- Importante: Enviar credenciales
    cache: "no-store" 
  })

  if (!res.ok) return []
  
  const clubs = await res.json()
  // Filtramos solo los activos
  return Array.isArray(clubs) ? clubs.filter((c: any) => c.is_active) : []
}

export async function getJudgeEvents() {
  return fetchAPI("/judge/events") // Llama a la ruta filtrada
}


