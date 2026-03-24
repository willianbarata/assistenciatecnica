'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { checkLimit } from "@/lib/limiter"

export async function getClients() {
    const session = await getSession()
    if (!session) return []

    const clients = await prisma.client.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })
    return clients
}

export async function createClient(formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Não autorizado")

    await checkLimit(session.user.id, 'clients')

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string

    // Address components
    const cep = formData.get('cep') as string
    const street = formData.get('street') as string
    const neighborhood = formData.get('neighborhood') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string

    const simpleAddress = formData.get('address') as string

    // Compute address
    let finalAddress = simpleAddress

    if (street || city || cep) {
        const parts = []
        if (street) parts.push(street)
        if (neighborhood) parts.push(neighborhood)
        if (city) parts.push(`${city}${state ? ' - ' + state : ''}`)
        if (cep) parts.push(`CEP: ${cep}`)
        finalAddress = parts.join(', ')
    }

    const cpfOrCnpj = formData.get('cpfOrCnpj') as string
    const whatsapp = formData.get('whatsapp') as string
    const notes = formData.get('notes') as string

    if (!name) throw new Error('Nome é obrigatório')

    await prisma.client.create({
        data: {
            name,
            email,
            phone,
            address: finalAddress,
            cpfOrCnpj,
            whatsapp,
            notes,
            userId: session.user.id
        }
    })

    revalidatePath('/clients')
    redirect('/clients')
}

export async function deleteClient(id: number) {
    const session = await getSession()
    if (!session) throw new Error("Não autorizado")

    // Ensure user owns content
    const client = await prisma.client.findFirst({
        where: { id, userId: session.user.id }
    })

    if (!client) throw new Error("Cliente não encontrado ou acesso negado")

    await prisma.client.delete({
        where: { id }
    })

    revalidatePath('/clients')
}
