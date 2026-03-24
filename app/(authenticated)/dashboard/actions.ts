'use server'

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function getDashboardStats() {
    const session = await getSession()
    if (!session) return {
        revenue: 0,
        cost: 0,
        profit: 0,
        activeOrders: 0,
        lowStock: [],
        recentOrders: []
    }

    // 1. Total Revenue (Sum of all PAID Payments)
    const paidPayments = await prisma.payment.findMany({
        where: { userId: session.user.id, status: 'PAID' }
    })

    const totalRevenue = paidPayments.reduce((acc: number, t: any) => acc + Number(t.amount), 0)

    // 2. Calculate Cost (Only for items in orders that have been PAID)
    // Find orders associated with paid payments
    const paidOrderIds = paidPayments.map((t: any) => t.orderId)

    const paidOrdersItems = await prisma.orderItem.findMany({
        where: {
            orderId: { in: paidOrderIds },
            order: { userId: session.user.id }
        }
    })

    let totalCost = 0
    for (const item of paidOrdersItems) {
        totalCost += Number(item.unitCost) * item.quantity
    }

    const profit = totalRevenue - totalCost

    // 3. Active Orders (Not Completed)
    const activeOrdersCount = await prisma.serviceOrder.count({
        where: { userId: session.user.id, status: { not: 'COMPLETED' } }
    })

    // Low Stock Items
    const lowStockProductsRaw = await prisma.product.findMany({
        where: { userId: session.user.id, stock: { lte: 3 } },
        take: 5
    })
    const lowStockProducts = lowStockProductsRaw.map((p: any) => ({
        ...p,
        price: Number(p.price),
        cost: Number(p.cost)
    }))

    // Recent Orders
    const recentOrdersRaw = await prisma.serviceOrder.findMany({
        where: { userId: session.user.id },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { client: true }
    })
    const recentOrders = recentOrdersRaw.map((o: any) => ({
        ...o,
        total: Number(o.total)
    }))

    return {
        revenue: totalRevenue,
        cost: totalCost,
        profit: profit,
        activeOrders: activeOrdersCount,
        lowStock: lowStockProducts,
        recentOrders
    }
}
