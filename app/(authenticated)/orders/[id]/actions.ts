'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"

export async function getOrder(id: number) {
    const session = await getSession()
    if (!session) return null

    const orderRaw = await prisma.serviceOrder.findUnique({
        where: { id, userId: session.user.id },
        include: {
            client: true,
            items: {
                include: {
                    product: true,
                    service: true
                }
            },
            payments: true,
            history: {
                include: { user: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!orderRaw) return null

    // Serialize
    return {
        ...orderRaw,
        total: Number(orderRaw.total),
        items: orderRaw.items.map(i => ({
            ...i,
            unitPrice: Number(i.unitPrice),
            unitCost: Number(i.unitCost),
            total: Number(i.unitPrice) * i.quantity,
            product: i.product ? {
                ...i.product,
                price: Number(i.product.price),
                cost: Number(i.product.cost)
            } : null,
            service: i.service ? {
                ...i.service,
                price: Number(i.service.price)
            } : null
        })),
        payments: orderRaw.payments.map((t: any) => ({
            ...t,
            amount: Number(t.amount)
        }))
    }
}

export async function updateStatus(id: number, status: string) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    // Verify first
    const order = await prisma.serviceOrder.findUnique({ where: { id, userId: session.user.id } })
    if (!order) throw new Error("Not Found")

    await prisma.$transaction([
        prisma.serviceOrder.update({
            where: { id },
            data: { status }
        }),
        prisma.oSHistory.create({
            data: {
                orderId: id,
                userId: session.user.id,
                status: status,
                notes: `Status alterado para ${status}`
            }
        })
    ])

    revalidatePath(`/orders/${id}`)
    revalidatePath('/orders')
    revalidatePath('/dashboard')
}

export async function registerPayment(orderId: number, data: {
    method: string,
    installments: number
}) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const order = await prisma.serviceOrder.findUnique({
        where: { id: orderId, userId: session.user.id }
    })

    if (!order) throw new Error("Order not found")

    // Create Payment
    await prisma.payment.create({
        data: {
            userId: session.user.id,
            orderId: order.id,
            amount: order.total,
            status: 'PAID',
            method: data.method,
            installments: data.installments,
            paidAt: new Date()
        }
    })

    // Update Status to COMPLETED if not already
    if (order.status !== 'COMPLETED') {
        await prisma.serviceOrder.update({
            where: { id: orderId },
            data: { status: 'COMPLETED' }
        })
    }

    revalidatePath(`/orders/${orderId}`)
    revalidatePath('/dashboard')
}

export async function cancelOrder(id: number) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    await prisma.$transaction(async (tx: any) => {
        const order = await tx.serviceOrder.findUnique({
            where: { id, userId: session.user.id },
            include: { items: true, payments: true }
        })

        if (!order) throw new Error("Order not found")
        if (order.status === 'CANCELLED') return

        // Restore Stock
        for (const item of order.items) {
            if (item.productId) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } }
                })
            }
        }

        // Cancel Payments
        await tx.payment.updateMany({
            where: { orderId: id },
            data: { status: 'CANCELLED' }
        })

        // Update Order Status
        await tx.serviceOrder.update({
            where: { id },
            data: { status: 'CANCELLED' }
        })
    })

    revalidatePath(`/orders/${id}`)
    revalidatePath('/orders')
    revalidatePath('/dashboard')
}
