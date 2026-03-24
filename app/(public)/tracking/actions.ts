'use server'
import { prisma } from "@/lib/prisma"

export async function checkOrderStatus(orderId: number) {
    // raw query for speed/consistency
    const orders: any[] = await prisma.$queryRaw`
        SELECT so.id, so.status, so.device, so.total, so.entryDate, so.exitDate, 
               so.description, so.diagnosis,
               c.name as clientName
        FROM "ServiceOrder" so
        JOIN "Client" c ON so.clientId = c.id
        WHERE so.id = ${orderId}
    `

    if (orders.length === 0) return null

    const order = orders[0]
    // Privacy: Return only first name to confirm identity without leaking full name
    const firstName = order.clientName.split(' ')[0]

    return {
        ...order,
        clientName: firstName,
        total: Number(order.total)
    }
}
