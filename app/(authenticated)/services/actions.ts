'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { checkLimit } from "@/lib/limiter"

export async function getServices() {
    const session = await getSession()
    if (!session) return []

    const servicesRaw = await prisma.service.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    // Serialize Decimals
    const services = servicesRaw.map((s: any) => ({
        ...s,
        price: Number(s.price)
    }))

    return services
}

export async function createService(formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Não autorizado")

    await checkLimit(session.user.id, 'services')

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)

    if (!name) throw new Error('Nome é obrigatório')

    await prisma.service.create({
        data: {
            name,
            description,
            price: isNaN(price) ? 0 : price,
            userId: session.user.id
        }
    })

    revalidatePath('/services')
    redirect('/services')
}
