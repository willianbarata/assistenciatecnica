
import { prisma } from "@/lib/prisma"
import { PLAN_LIMITS, PlanType } from "@/lib/plan-limits"

export async function checkLimit(userId: number, resource: 'clients' | 'products' | 'services' | 'orders' | 'marketplace') {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true }
    })

    if (!user) {
        // If user not found, we can't check limits. 
        // Should effectively fail or assume strict limits? 
        // Assuming user exists for authenticated actions.
        throw new Error("Usuário não encontrado.")
    }

    const plan = (user.plan as PlanType) || 'FREE'
    const limits = PLAN_LIMITS[plan]

    if (resource === 'orders' && plan === 'PRO') {
        // Monthly check for PRO
        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        const count = await prisma.serviceOrder.count({
            where: {
                userId,
                createdAt: { gte: firstDay }
            }
        })
        if (count >= limits.orders) {
            throw new Error(`Limite mensal de Ordens de Serviço atingido (${limits.orders}/mês). Atualize seu plano.`)
        }
        return
    }

    // General check
    let count = 0
    let limit = 0

    switch (resource) {
        case 'clients':
            count = await prisma.client.count({ where: { userId } })
            limit = limits.clients
            break
        case 'products':
            count = await prisma.product.count({ where: { userId } })
            limit = limits.products
            break
        case 'services':
            count = await prisma.service.count({ where: { userId } })
            limit = limits.services
            break
        case 'orders':
            // For FREE or ENTERPRISE (if distinct handling needed). 
            // FREE is total limit. ENTERPRISE is Infinity.
            count = await prisma.serviceOrder.count({ where: { userId } })
            limit = limits.orders
            break
        case 'marketplace':
            count = await prisma.product.count({ where: { userId, isPublic: true } })
            limit = limits.marketplace
            break
    }

    if (limit !== Infinity && count >= limit) {
        throw new Error(`Limite de ${translateResource(resource)} atingido (${count}/${limit}). Atualize seu plano.`)
    }
}

function translateResource(resource: string) {
    switch (resource) {
        case 'clients': return "Clientes"
        case 'products': return "Produtos"
        case 'services': return "Serviços"
        case 'orders': return "Ordens de Serviço"
        case 'marketplace': return "Anúncios"
        default: return resource
    }
}
