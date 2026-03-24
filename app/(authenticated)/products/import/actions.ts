'use server'

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function importProducts(formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const file = formData.get('file') as File
    if (!file) throw new Error("Nenhum arquivo enviado")

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim() !== '')

    // Assume CSV Header: name, description, price, cost, stock
    // Remove header
    lines.shift()

    let count = 0

    for (const line of lines) {
        // Simple Split - in prod use a proper parser
        const cols = line.split(',')
        if (cols.length < 5) continue

        const [name, description, price, cost, stock] = cols.map(c => c.trim())

        await prisma.product.create({
            data: {
                userId: session.user.id,
                name,
                description,
                price: parseFloat(price) || 0,
                cost: parseFloat(cost) || 0,
                stock: parseInt(stock) || 0
            }
        })
        count++
    }

    revalidatePath('/products')
    redirect('/products')
}
