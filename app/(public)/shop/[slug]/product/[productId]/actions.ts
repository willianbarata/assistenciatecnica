'use server'

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function getProduct(id: number) {
    const products: any[] = await prisma.$queryRaw`
        SELECT p.*, u.name as userName, u.phone as userPhone
        FROM "Product" p
        JOIN "User" u ON p.userId = u.id
        WHERE p.id = ${id}
    `
    if (products.length === 0) return null
    const p = products[0]

    const images: any[] = await prisma.$queryRaw`SELECT url FROM "ProductImage" WHERE productId = ${id}`

    return {
        ...p,
        price: Number(p.price),
        user: { name: p.userName, phone: p.userPhone },
        images
    }
}

export async function sendInquiry(formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Você precisa fazer login.")

    const productId = Number(formData.get("productId"))
    const message = formData.get("message") as string

    if (!message) throw new Error("Digite uma mensagem")

    // Get sellerId
    const products: any[] = await prisma.$queryRaw`SELECT userId FROM "Product" WHERE id = ${productId}`
    if (products.length === 0) throw new Error("Produto não encontrado")
    const sellerId = products[0].userId

    const now = Date.now()
    const clientId = session.user.id
    const visitorName = session.user.name
    const visitorPhone = session.user.phone || ""

    await prisma.$executeRaw`
        INSERT INTO "ProductInquiry" (sellerId, productId, visitorName, visitorPhone, message, createdAt, read, clientId)
        VALUES (${sellerId}, ${productId}, ${visitorName}, ${visitorPhone}, ${message}, ${now}, 0, ${clientId})
    `

    return { success: true }
}
