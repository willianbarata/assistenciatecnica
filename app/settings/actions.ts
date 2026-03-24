'use server'

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

import { revalidatePath } from "next/cache"

export async function getUserSettings() {
    const session = await getSession()
    if (!session) return null

    // Use queryRaw to bypass outdated Prisma Client if needed for new fields
    const users = await prisma.$queryRaw`SELECT * FROM "User" WHERE id = ${session.user.id}` as any[]
    const user = users[0]

    return user
}

export async function updateSettings(formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const phone = formData.get("phone") as string

    // Use executeRaw to update safely
    await prisma.$executeRaw`UPDATE "User" SET phone = ${phone} WHERE id = ${session.user.id}`

    revalidatePath("/settings")
}

export async function updateSlug(formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const slug = formData.get("slug") as string
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')

    if (cleanSlug.length < 3) throw new Error("Nome muito curto (min 3 chars)")

    // Check uniqueness (Raw query to be safe)
    const existing: any[] = await prisma.$queryRaw`SELECT id FROM "User" WHERE slug = ${cleanSlug} AND id != ${session.user.id}`

    if (existing.length > 0) {
        throw new Error("Esta URL já está em uso por outra loja")
    }

    await prisma.$executeRaw`UPDATE "User" SET slug = ${cleanSlug} WHERE id = ${session.user.id}`

    revalidatePath("/settings")
    return { success: true, slug: cleanSlug }
}
