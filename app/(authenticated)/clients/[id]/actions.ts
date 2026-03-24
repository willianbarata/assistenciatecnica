'use server'

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getClient(id: number) {
    const session = await getSession()
    if (!session) return null

    return await prisma.client.findUnique({
        where: { id, userId: session.user.id }
    })
}

export async function getClientDevices(clientId: number) {
    const session = await getSession()
    if (!session) return []

    return await prisma.device.findMany({
        where: { clientId, client: { userId: session.user.id } },
        orderBy: { updatedAt: 'desc' }
    })
}

export async function createDevice(clientId: number, formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const brand = formData.get('brand') as string
    const model = formData.get('model') as string
    const imei = formData.get('imei') as string
    const color = formData.get('color') as string
    const condition = formData.get('condition') as string
    const accessories = formData.get('accessories') as string

    if (!brand || !model) throw new Error("Marca e Modelo obrigatórios")

    await prisma.device.create({
        data: {
            clientId,
            brand,
            model,
            imei,
            color,
            condition,
            accessories
        }
    })

    revalidatePath(`/clients/${clientId}`)
    redirect(`/clients/${clientId}`)
}
