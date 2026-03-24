'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { checkLimit } from "@/lib/limiter"

export async function getOrders(startDate?: string, endDate?: string) {
    const session = await getSession()
    if (!session) return []

    const where: any = { userId: session.user.id }

    if (startDate && endDate) {
        where.createdAt = {
            gte: new Date(startDate),
            lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
        }
    }

    const ordersRaw = await prisma.serviceOrder.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            client: true
        }
    })

    // Serialize Decimals for Client Components
    const orders = ordersRaw.map((order: any) => ({
        ...order,
        total: Number(order.total)
    }))

    return orders
}

// Fetch helper for form
export async function getClientsAndItems() {
    const session = await getSession()
    if (!session) return { clients: [], products: [], services: [] }

    const clients = await prisma.client.findMany({
        where: { userId: session.user.id },
        orderBy: { name: 'asc' }
    })

    const productsRaw = await prisma.product.findMany({
        where: { userId: session.user.id, stock: { gt: 0 } },
        orderBy: { name: 'asc' }
    })
    const products = productsRaw.map((p: any) => ({
        ...p,
        price: Number(p.price),
        cost: Number(p.cost)
    }))

    const servicesRaw = await prisma.service.findMany({
        where: { userId: session.user.id },
        orderBy: { name: 'asc' }
    })
    const services = servicesRaw.map(s => ({
        ...s,
        price: Number(s.price)
    }))

    return { clients, products, services }
}

export async function createOrder(formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Não autorizado")

    await checkLimit(session.user.id, 'orders')

    const clientId = parseInt(formData.get('clientId') as string)
    const deviceId = formData.get('deviceId') ? parseInt(formData.get('deviceId') as string) : null
    const device = formData.get('device') as string
    const description = formData.get('description') as string
    const itemsJson = formData.get('items') as string

    if (!clientId || !device) throw new Error('Dados incompletos')

    let items = []
    try {
        items = JSON.parse(itemsJson)
    } catch (e) {
        throw new Error('Erro ao processar itens')
    }

    let total = 0
    const orderItemsData: any[] = []

    // Validate and Build Items Data
    for (const item of items) {
        let unitPrice = 0
        let unitCost = 0

        if (item.type === 'PRODUCT') {
            const product = await prisma.product.findUnique({
                where: { id: item.id, userId: session.user.id }
            })
            if (!product) continue
            unitPrice = Number(product.price)
            unitCost = Number(product.cost)
        } else if (item.type === 'SERVICE') {
            const service = await prisma.service.findUnique({
                where: { id: item.id, userId: session.user.id }
            })
            if (!service) continue
            unitPrice = Number(service.price)
        }

        total += unitPrice * item.quantity

        orderItemsData.push({
            productId: item.type === 'PRODUCT' ? item.id : null,
            serviceId: item.type === 'SERVICE' ? item.id : null,
            quantity: item.quantity,
            unitPrice,
            unitCost
        })
    }

    await prisma.$transaction(async (tx: any) => {
        const order = await tx.serviceOrder.create({
            data: {
                clientId,
                device,
                deviceId: deviceId !== null && !isNaN(deviceId) ? deviceId : undefined,
                description,
                total,
                status: 'OPEN',
                userId: session.user.id,
                items: {
                    create: orderItemsData
                }
            }
        })

        // Decrement Stock
        for (const item of items) {
            if (item.type === 'PRODUCT') {
                await tx.product.update({
                    where: { id: item.id },
                    data: { stock: { decrement: item.quantity } }
                })
            }
        }
    })

    revalidatePath('/orders')
    redirect('/orders')
}

export async function updateOrder(id: number, formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Não autorizado")

    const clientId = parseInt(formData.get('clientId') as string)
    const device = formData.get('device') as string
    const description = formData.get('description') as string
    const itemsJson = formData.get('items') as string

    if (!clientId || !device) throw new Error('Dados incompletos')

    let items = []
    try {
        items = JSON.parse(itemsJson)
    } catch (e) {
        throw new Error('Erro ao processar itens')
    }

    // Prepare new items data
    let total = 0
    const orderItemsData: any[] = []

    for (const item of items) {
        let unitPrice = 0
        let unitCost = 0

        if (item.type === 'PRODUCT') {
            const product = await prisma.product.findUnique({
                where: { id: item.id, userId: session.user.id }
            })
            if (!product) continue
            unitPrice = Number(product.price)
            unitCost = Number(product.cost)
        } else if (item.type === 'SERVICE') {
            const service = await prisma.service.findUnique({
                where: { id: item.id, userId: session.user.id }
            })
            if (!service) continue
            unitPrice = Number(service.price)
        }

        total += unitPrice * item.quantity

        orderItemsData.push({
            productId: item.type === 'PRODUCT' ? item.id : null,
            serviceId: item.type === 'SERVICE' ? item.id : null,
            quantity: item.quantity,
            unitPrice,
            unitCost
        })
    }

    await prisma.$transaction(async (tx: any) => {
        // 1. Get existing order items to restore stock
        const existingOrder = await tx.serviceOrder.findUnique({
            where: { id: id, userId: session.user.id },
            include: { items: true }
        })

        if (!existingOrder) throw new Error("Ordem não encontrada")

        // 2. Restore Stock
        for (const oldItem of existingOrder.items) {
            if (oldItem.productId) {
                await tx.product.update({
                    where: { id: oldItem.productId },
                    data: { stock: { increment: oldItem.quantity } }
                })
            }
        }

        // 3. Delete Old Items
        await tx.orderItem.deleteMany({
            where: { orderId: id }
        })

        // 4. Update Order Details
        await tx.serviceOrder.update({
            where: { id: id },
            data: {
                clientId,
                device,
                description,
                total,
                // Status is NOT updated automatically here to avoid overriding COMPLETED if just editing details
                // But if it was OPEN, it stays OPEN.
                items: {
                    create: orderItemsData
                }
            }
        })

        // 5. Decrement Stock for NEW items
        for (const item of items) {
            if (item.type === 'PRODUCT') {
                await tx.product.update({
                    where: { id: item.id },
                    data: { stock: { decrement: item.quantity } }
                })
            }
        }
    })

    revalidatePath('/orders')
    revalidatePath(`/orders/${id}`)
    redirect(`/orders/${id}`)
}
