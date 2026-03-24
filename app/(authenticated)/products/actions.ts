'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { checkLimit } from "@/lib/limiter"

export async function getProducts() {
    const session = await getSession()
    if (!session) return []

    const productsRaw = await prisma.product.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    // Serialize Decimals
    const products = productsRaw.map((p: any) => ({
        ...p,
        price: Number(p.price),
        cost: Number(p.cost)
    }))

    return products
}

export async function createProduct(formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Não autorizado")

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const cost = parseFloat(formData.get('cost') as string)
    const stock = parseInt(formData.get('stock') as string)

    const isPublic = formData.get('isPublic') === 'on'
    const publicTitle = formData.get('publicTitle') as string
    const condition = formData.get('condition') as string
    const imageUrl = formData.get('imageUrl') as string

    if (!name) throw new Error('Nome é obrigatório')

    await checkLimit(session.user.id, 'products')

    if (isPublic) {
        await checkLimit(session.user.id, 'marketplace')
    }

    await prisma.product.create({
        data: {
            name,
            description,
            price: isNaN(price) ? 0 : price,
            cost: isNaN(cost) ? 0 : cost,
            stock: isNaN(stock) ? 0 : stock,
            userId: session.user.id,
            isPublic,
            publicTitle,
            condition,
            images: imageUrl ? {
                create: { url: imageUrl }
            } : undefined
        }
    })

    revalidatePath('/products')
    redirect('/products')
}

export async function getProduct(id: number) {
    const session = await getSession()
    if (!session) return null

    const product = await prisma.product.findUnique({
        where: { id, userId: session.user.id },
        include: { images: true }
    })

    if (!product) return null

    return {
        ...product,
        price: Number(product.price),
        cost: Number(product.cost)
    }
}

export async function updateProduct(id: number, formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const cost = parseFloat(formData.get('cost') as string)
    const stock = parseInt(formData.get('stock') as string)

    const isPublic = formData.get('isPublic') === 'on'
    const publicTitle = formData.get('publicTitle') as string
    const condition = formData.get('condition') as string
    const imageUrl = formData.get('imageUrl') as string // Simple handling: add new, don't delete old for now

    // Check limits if making public
    if (isPublic) {
        // Only check if it wasn't public before
        const currentProduct = await prisma.product.findUnique({
            where: { id, userId: session.user.id },
            select: { isPublic: true }
        })

        if (currentProduct && !currentProduct.isPublic) {
            await checkLimit(session.user.id, 'marketplace')
        }
    }

    await prisma.product.update({
        where: { id, userId: session.user.id },
        data: {
            name,
            description,
            price: isNaN(price) ? 0 : price,
            cost: isNaN(cost) ? 0 : cost,
            stock: isNaN(stock) ? 0 : stock,
            isPublic,
            publicTitle,
            condition,
            images: imageUrl ? {
                create: { url: imageUrl }
            } : undefined
        }
    })

    revalidatePath('/products')
    redirect('/products')
}
