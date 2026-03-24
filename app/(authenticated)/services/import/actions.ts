'use server'

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function importServices(formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const file = formData.get('file') as File
    if (!file) throw new Error("Nenhum arquivo enviado")

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim() !== '')

    // Assume CSV Header: name, description, category, price
    // Remove header
    lines.shift()

    for (const line of lines) {
        const cols = line.split(',')
        if (cols.length < 4) continue

        const [name, description, category, price] = cols.map(c => c.trim())

        await prisma.service.create({
            data: {
                userId: session.user.id,
                name,
                description,
                category,
                price: parseFloat(price) || 0,
                defaultTimeMin: 60, // Default 1 hour
                isActive: true
            }
        })
    }

    revalidatePath('/services')
    redirect('/services')
}
