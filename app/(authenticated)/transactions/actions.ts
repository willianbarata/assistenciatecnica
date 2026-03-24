'use server'

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function getPayments(startDate?: string, endDate?: string) {
    const session = await getSession()
    if (!session) return []

    const where: any = { userId: session.user.id }

    if (startDate && endDate) {
        where.createdAt = {
            gte: new Date(startDate),
            lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
        }
    }

    const paymentsRaw = await prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            order: {
                include: { client: true }
            }
        }
    })

    // Serialize
    return paymentsRaw.map((t: any) => ({
        ...t,
        amount: Number(t.amount),
        order: {
            ...t.order,
            total: Number(t.order.total)
        }
    }))
}

export async function getFinanceStats() {
    const session = await getSession()
    if (!session) return { received: 0, pending: 0, open: 0 }

    // 1. Received: Sum of PAID payments
    const paidPayments = await prisma.payment.aggregate({
        where: { userId: session.user.id, status: 'PAID' },
        _sum: { amount: true }
    })
    const received = Number(paidPayments._sum.amount || 0)

    // 2. Pending (Receivable): Completed Orders BUT NOT Fully Paid
    // We fetch ALL Completed orders and check their payment sum
    const completedOrders = await prisma.serviceOrder.findMany({
        where: { userId: session.user.id, status: { in: ['COMPLETED', 'WAITING_PARTS'] } },
        include: { payments: true }
    })

    let pending = 0
    for (const order of completedOrders) {
        const orderTotal = Number(order.total)
        const paidAmount = order.payments
            .filter(p => p.status === 'PAID')
            .reduce((sum, p) => sum + Number(p.amount), 0)

        if (paidAmount < orderTotal) {
            pending += (orderTotal - paidAmount)
        }
    }

    // 3. Open (Potential): Orders that are still being worked on (OPEN, IN_PROGRESS)
    // WAITING_PARTS could be here or above. User said: "pendente (produto concluído) e pendente (produto não está pronto)"
    // Let's treat WAITING_PARTS as "Not Ready" -> Open/Potential. 
    // And COMPLETED as "Ready" -> Pending/Receivable.

    // RE-EVALUATE: 
    // "Produto Concluído" (COMPLETED) -> Receivable (Pending Payment)
    // "Produto Não Pronto" (OPEN, IN_PROGRESS, WAITING_PARTS) -> Future Revenue (Open)

    const openOrders = await prisma.serviceOrder.aggregate({
        where: {
            userId: session.user.id,
            status: { in: ['OPEN', 'IN_PROGRESS', 'WAITING_PARTS'] }
        },
        _sum: { total: true }
    })
    const open = Number(openOrders._sum.total || 0)

    // Re-adjust pending calc to strictly COMPLETED
    const strictlyCompletedOrders = await prisma.serviceOrder.findMany({
        where: { userId: session.user.id, status: 'COMPLETED' },
        include: { payments: true }
    })
    let strictlyPending = 0
    for (const order of strictlyCompletedOrders) {
        const orderTotal = Number(order.total)
        const paidAmount = order.payments
            .filter(p => p.status === 'PAID')
            .reduce((sum, p) => sum + Number(p.amount), 0)

        if (paidAmount < orderTotal) {
            strictlyPending += (orderTotal - paidAmount)
        }
    }

    return {
        received,
        pending: strictlyPending, // Concluído mas não pago
        open // Em aberto/trabalhando
    }
}
