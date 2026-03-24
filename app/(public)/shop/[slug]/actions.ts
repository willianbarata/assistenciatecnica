'use server'

import { prisma } from "@/lib/prisma"

export async function getShop(identifier: string) {
    let user = null

    // 1. Try by Slug
    const bySlug = await prisma.$queryRaw`SELECT id, name, email, phone, slug FROM "User" WHERE slug = ${identifier}` as any[]
    if (bySlug.length > 0) {
        user = bySlug[0]
    } else {
        // 2. Try by ID
        const id = parseInt(identifier)
        if (!isNaN(id)) {
            const byId = await prisma.$queryRaw`SELECT id, name, email, phone, slug FROM "User" WHERE id = ${id}` as any[]
            user = byId[0]
        }
    }

    if (!user) return null

    const productsRaw = await prisma.$queryRaw`
        SELECT p.*, 
               (SELECT url FROM "ProductImage" WHERE productId = p.id LIMIT 1) as imageUrl 
        FROM "Product" p 
        WHERE p.userId = ${user.id} 
          AND p.isPublic = 1 
          AND p.stock > 0
        ORDER BY p.createdAt DESC
    ` as any[]

    const products = productsRaw.map(p => ({
        ...p,
        price: Number(p.price),
        images: p.imageUrl ? [{ url: p.imageUrl }] : []
    }))

    return { user, products }
}
