'use server'
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function getMessages() {
    const session = await getSession()
    if (!session) return []

    // Raw SQL to fetch inquiries (due to outdated client)
    const msgs: any[] = await prisma.$queryRaw`
        SELECT pi.*, p.name as productName, p.id as productId,
               (SELECT url FROM "ProductImage" WHERE productId = p.id LIMIT 1) as productImage
        FROM "ProductInquiry" pi
        JOIN "Product" p ON pi.productId = p.id
        WHERE pi.sellerId = ${session.user.id}
        ORDER BY pi.createdAt DESC
    `
    return msgs
}
