'use server'

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function importClients(formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const file = formData.get('file') as File
    if (!file) throw new Error("Nenhum arquivo enviado")

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim() !== '')

    // Assume CSV Header: name, cpfOrCnpj, email, phone, whatsapp, cep, logradouro, bairro, cidade, estado, notes
    lines.shift()

    let count = 0

    for (const line of lines) {
        const cols = line.split(',').map(c => c.trim())
        if (cols.length < 1) continue

        // Destructure expecting specific order
        const [name, cpfOrCnpj, email, phone, whatsapp, cep, logradouro, bairro, cidade, estado, notes] = cols

        if (!name) continue

        // Format address from separated fields
        const addressParts = []
        if (logradouro) addressParts.push(logradouro)
        if (bairro) addressParts.push(bairro)
        if (cidade) addressParts.push(`${cidade}${estado ? ' - ' + estado : ''}`)
        if (cep) addressParts.push(`CEP: ${cep}`)

        const address = addressParts.join(', ')

        // 1. Create with basic fields known to exist
        const client = await prisma.client.create({
            data: {
                userId: session.user.id,
                name,
                email: email || null,
                phone: phone || null,
                address: address || null,
            }
        })

        // 2. Update new fields via Raw SQL to bypass stale Prisma Client
        if (cpfOrCnpj || whatsapp || notes) {
            await prisma.$executeRaw`
                UPDATE "Client" 
                SET "cpfOrCnpj" = ${cpfOrCnpj || null}, 
                    "whatsapp" = ${whatsapp || null}, 
                    "notes" = ${notes || null}
                WHERE id = ${client.id}
            `
        }
        count++
    }

    revalidatePath('/clients')
    return { success: true, count }
}
