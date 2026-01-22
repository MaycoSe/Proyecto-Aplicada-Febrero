"use server"

import { revalidatePath } from "next/cache"
import { createAuditLog } from "@/lib/audit"
import type { Score, Sanction, Event, Club } from "@/lib/types"
import { mockScores, mockSanctions, mockEvents, mockClubs } from "@/lib/mock-data"

// --- LÓGICA DE PUNTAJES ---

export async function submitScore(prevState: any, formData: FormData) {
  try {
    const eventId = formData.get("eventId") as string
    const clubId = formData.get("clubId") as string
    const userId = "user-123" // TODO: Auth real
    const evaluationType = formData.get("evaluationType") as string
    const notes = formData.get("notes") as string
    
    let finalScore = 0
    let details = {}
    let standardScores = {}

    if (evaluationType === "inspection") {
      const rawDetails = formData.get("inspectionDetails") as string
      if (rawDetails) {
        details = JSON.parse(rawDetails)
        finalScore = Object.values(details).reduce((a: number, b: any) => a + Number(b), 0)
      }
    } else {
      finalScore = Number(formData.get("standardTotal") || 0)
      standardScores = {
        creativityScore: Number(formData.get("creativityScore") || 0),
        executionScore: Number(formData.get("executionScore") || 0),
        presentationScore: Number(formData.get("presentationScore") || 0),
      }
    }

    const newScore: Score = {
      id: crypto.randomUUID(),
      eventId,
      clubId,
      judgeId: userId,
      score: finalScore,
      notes,
      details: evaluationType === "inspection" ? details : undefined,
      ...standardScores,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockScores.push(newScore)
    console.log("💾 [DB] Score Saved:", newScore)

    await createAuditLog({
      userId,
      action: "CREATE",
      entityType: "SCORE",
      entityId: newScore.id,
      newValues: { score: finalScore, clubId, type: evaluationType }
    })

    revalidatePath("/judge")
    return { success: true, message: "Evaluación registrada correctamente" }

  } catch (error) {
    console.error("Error submitting score:", error)
    return { success: false, message: "Error al guardar la evaluación" }
  }
}

// --- LÓGICA DE SANCIONES ---

export async function submitSanction(prevState: any, formData: FormData) {
  try {
    const eventId = formData.get("eventId") as string
    const clubId = formData.get("clubId") as string
    const judgeId = "user-123"
    const description = formData.get("description") as string
    const pointsDeducted = Number(formData.get("pointsDeducted"))

    if (!clubId || !description || pointsDeducted <= 0) {
      return { success: false, message: "Datos inválidos. Verifique el club y los puntos." }
    }

    const newSanction: Sanction = {
      id: crypto.randomUUID(),
      clubId,
      eventId,
      judgeId,
      sanctionType: "Disciplinary",
      description,
      pointsDeducted,
      appliedAt: new Date().toISOString(),
    }

    mockSanctions.push(newSanction)
    console.log("⚠️ [DB] Sanction Applied:", newSanction)

    await createAuditLog({
      userId: judgeId,
      action: "SANCTION",
      entityType: "SANCTION",
      entityId: newSanction.id,
      newValues: { clubId, points: pointsDeducted, reason: description }
    })

    revalidatePath("/judge")
    return { success: true, message: "Sanción aplicada correctamente" }

  } catch (error) {
    console.error("Error applying sanction:", error)
    return { success: false, message: "Error al procesar la sanción" }
  }
}

// --- LÓGICA DE EVENTOS ---

export async function createEvent(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const eventType = formData.get("eventType") as string
    const evaluationType = formData.get("evaluationType") as "standard" | "inspection"
    const maxScore = Number(formData.get("maxScore"))
    const weight = Number(formData.get("weight"))
    const description = formData.get("description") as string
    const isActive = formData.get("isActive") === "on"
    const userId = "user-123"

    if (!name || maxScore <= 0) {
      return { success: false, message: "Nombre y puntaje máximo son obligatorios." }
    }

    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      name,
      eventType,
      evaluationType,
      description,
      maxScore,
      weight,
      isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockEvents.push(newEvent)
    console.log("📅 [DB] Event Created:", newEvent)

    await createAuditLog({
      userId,
      action: "CREATE",
      entityType: "EVENT",
      entityId: newEvent.id,
      newValues: { name, type: eventType }
    })

    revalidatePath("/admin/events")
    return { success: true, message: "Evento creado exitosamente" }

  } catch (error) {
    console.error("Error creating event:", error)
    return { success: false, message: "Error al crear el evento" }
  }
}

export async function updateEvent(prevState: any, formData: FormData) {
  try {
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const eventType = formData.get("eventType") as string
    const evaluationType = formData.get("evaluationType") as "standard" | "inspection"
    const maxScore = Number(formData.get("maxScore"))
    const weight = Number(formData.get("weight"))
    const description = formData.get("description") as string
    const isActive = formData.get("isActive") === "on"
    const userId = "user-123"

    if (!id || !name) return { success: false, message: "ID y Nombre son obligatorios." }

    const index = mockEvents.findIndex((e) => e.id === id)
    if (index === -1) return { success: false, message: "Evento no encontrado." }

    const updatedEvent = {
      ...mockEvents[index],
      name,
      eventType,
      evaluationType,
      maxScore,
      weight,
      description,
      isActive,
      updatedAt: new Date().toISOString()
    }

    mockEvents[index] = updatedEvent
    console.log("📝 [DB] Event Updated:", updatedEvent)

    await createAuditLog({
      userId,
      action: "UPDATE",
      entityType: "EVENT",
      entityId: id,
      newValues: { name, type: eventType }
    })

    revalidatePath("/admin/events")
    return { success: true, message: "Evento actualizado correctamente" }

  } catch (error) {
    console.error("Error updating event:", error)
    return { success: false, message: "Error al actualizar el evento" }
  }
}

export async function assignJudges(prevState: any, formData: FormData) {
  try {
    const eventId = formData.get("eventId") as string
    const selectedJudges = formData.getAll("judges") as string[]
    
    if (!eventId) return { success: false, message: "ID de evento no válido." }

    const eventIndex = mockEvents.findIndex((e) => e.id === eventId)
    if (eventIndex === -1) return { success: false, message: "Evento no encontrado." }

    mockEvents[eventIndex].assignedJudges = selectedJudges

    await createAuditLog({
      userId: "user-123",
      action: "UPDATE",
      entityType: "EVENT",
      entityId: eventId,
      newValues: { assignedJudges: selectedJudges }
    })

    revalidatePath(`/admin/events`)
    return { success: true, message: "Jueces asignados correctamente." }

  } catch (error) {
    console.error("Error assigning judges:", error)
    return { success: false, message: "Error al guardar la asignación." }
  }
}

// --- LÓGICA DE CLUBES (NUEVO) ---

export async function createClub(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const code = formData.get("code") as string
    const description = formData.get("description") as string
    const isActive = formData.get("isActive") === "on"
    const userId = "user-123"

    if (!name || !code) {
      return { success: false, message: "Nombre y Código son obligatorios." }
    }

    const newClub: Club = {
      id: `club-${Date.now()}`,
      name,
      code: code.toUpperCase(),
      description,
      isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockClubs.push(newClub)
    console.log("🏆 [DB] Club Created:", newClub)

    await createAuditLog({
      userId,
      action: "CREATE",
      entityType: "CLUB",
      entityId: newClub.id,
      newValues: { name, code }
    })

    revalidatePath("/admin/clubs")
    return { success: true, message: "Club creado exitosamente" }

  } catch (error) {
    console.error("Error creating club:", error)
    return { success: false, message: "Error al crear el club" }
  }
}

export async function updateClub(prevState: any, formData: FormData) {
  try {
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const code = formData.get("code") as string
    const description = formData.get("description") as string
    const isActive = formData.get("isActive") === "on"
    const userId = "user-123"

    if (!id || !name) return { success: false, message: "Datos incompletos." }

    const index = mockClubs.findIndex(c => c.id === id)
    if (index === -1) return { success: false, message: "Club no encontrado." }

    const updatedClub = {
      ...mockClubs[index],
      name,
      code: code.toUpperCase(),
      description,
      isActive,
      updatedAt: new Date().toISOString()
    }

    mockClubs[index] = updatedClub
    
    await createAuditLog({
      userId,
      action: "UPDATE",
      entityType: "CLUB",
      entityId: id,
      newValues: { name, code }
    })

    revalidatePath("/admin/clubs")
    return { success: true, message: "Club actualizado correctamente" }

  } catch (error) {
    console.error("Error updating club:", error)
    return { success: false, message: "Error al actualizar" }
  }
}


// ... (al final de app/actions.ts)

// --- LÓGICA DE USUARIOS ---
import { User } from "@/lib/types" // Asegurar importación
import { mockUsers } from "@/lib/mock-data" // Asegurar importación

export async function createUser(prevState: any, formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const role = formData.get("role") as "admin" | "judge"
    const isActive = formData.get("isActive") === "on"
    const currentUserId = "user-123"

    if (!fullName || !email) {
      return { success: false, message: "Nombre y Email son obligatorios." }
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      fullName,
      email,
      role,
      isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)
    console.log("👤 [DB] User Created:", newUser)

    await createAuditLog({
      userId: currentUserId,
      action: "CREATE",
      entityType: "USER",
      entityId: newUser.id,
      newValues: { fullName, role }
    })

    revalidatePath("/admin/users")
    return { success: true, message: "Usuario creado exitosamente" }

  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, message: "Error al crear usuario" }
  }
}

export async function updateUser(prevState: any, formData: FormData) {
  try {
    const id = formData.get("id") as string
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const role = formData.get("role") as "admin" | "judge"
    const isActive = formData.get("isActive") === "on"
    const currentUserId = "user-123"

    if (!id || !fullName) return { success: false, message: "Datos incompletos." }

    const index = mockUsers.findIndex(u => u.id === id)
    if (index === -1) return { success: false, message: "Usuario no encontrado." }

    const updatedUser = {
      ...mockUsers[index],
      fullName,
      email,
      role,
      isActive,
      updatedAt: new Date().toISOString()
    }

    mockUsers[index] = updatedUser
    
    await createAuditLog({
      userId: currentUserId,
      action: "UPDATE",
      entityType: "USER",
      entityId: id,
      newValues: { fullName, role, isActive }
    })

    revalidatePath("/admin/users")
    return { success: true, message: "Usuario actualizado correctamente" }

  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, message: "Error al actualizar" }
  }
}


// ... (al final de app/actions.ts)

// --- ACCIONES RÁPIDAS DE USUARIO ---

export async function resetPassword(userId: string) {
  // En un caso real, esto enviaría un email o cambiaría el hash en DB
  // Aquí simulamos reseteo a "camp2026"
  console.log(`🔐 [AUTH] Contraseña restablecida para usuario ${userId} a 'camp2026'`)
  
  await createAuditLog({
    userId: "user-123", // Admin
    action: "UPDATE",
    entityType: "USER",
    entityId: userId,
    newValues: { passwordReset: true }
  })
  
  // No necesitamos revalidar path visualmente, pero es buena práctica
  revalidatePath("/admin/users")
  return { success: true, message: "Contraseña restablecida a: camp2026" }
}

export async function toggleUserStatus(userId: string, isActive: boolean) {
  const index = mockUsers.findIndex(u => u.id === userId)
  if (index !== -1) {
    mockUsers[index].isActive = isActive
    
    await createAuditLog({
      userId: "user-123",
      action: "UPDATE",
      entityType: "USER",
      entityId: userId,
      newValues: { isActive }
    })
    
    revalidatePath("/admin/users")
    return { success: true, message: isActive ? "Usuario activado" : "Usuario desactivado" }
  }
  return { success: false, message: "Usuario no encontrado" }
}