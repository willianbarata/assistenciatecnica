'use server'

import { prisma } from "@/lib/prisma"

export async function getMarketplaceProducts() {
    const products: any[] = await prisma.$queryRaw`
        SELECT p.*,
               u.name as userName, u.email as userEmail, u.phone as userPhone, u.slug as userSlug,
               (SELECT url FROM "ProductImage" WHERE productId = p.id LIMIT 1) as imageUrl
        FROM "Product" p
        JOIN "User" u ON p.userId = u.id
        WHERE p.isPublic = 1 AND p.stock > 0
        ORDER BY p.createdAt DESC
        LIMIT 50
    `

    return products.map(p => ({
        ...p,
        price: Number(p.price),
        cost: Number(p.cost),
        user: {
            name: p.userName,
            email: p.userEmail,
            phone: p.userPhone,
            slug: p.userSlug
        },
        images: p.imageUrl ? [{ url: p.imageUrl }] : []
    }))
}
