'use server'
import { getSession, logout as sessionLogout } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function logoutAction() {
    await sessionLogout()
    redirect("/login")
}

export async function getClientMessages() {
    const session = await getSession()
    if (!session) return []

    // Allow user.role CLIENT, but also maybe normal USER viewing their bought stuff?
    // Just filter by ID.
    const userId = session.user.id
    const userPhone = typeof session.user.phone === 'string' ? session.user.phone : "000"

    // Raw SQL to fetch sent inquiries
    // Match by clientId (if linked) OR phone (legacy/unlinked)
    const msgs: any[] = await prisma.$queryRaw`
        SELECT pi.*, 
               p.name as productName, p.id as pId,
               u.name as sellerName, u.slug as sellerSlug,
               (SELECT url FROM "ProductImage" WHERE productId = p.id LIMIT 1) as productImage
        FROM "ProductInquiry" pi
        JOIN "Product" p ON pi.productId = p.id
        JOIN "User" u ON pi.sellerId = u.id
        WHERE pi.clientId = ${userId} OR pi.visitorPhone = ${userPhone}
        ORDER BY pi.createdAt DESC
    `
    return msgs
}
