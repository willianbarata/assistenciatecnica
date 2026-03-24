'use server'

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getCashRegister() {
    const session = await getSession()
    if (!session) return null

    // Find active register (Status OPEN)
    const active = await prisma.cashRegister.findFirst({
        where: { userId: session.user.id, status: 'OPEN' },
        include: { transactions: true }
    })

    if (active) {
        // Also fetch payments received TODAY (since openTime)
        const payments = await prisma.payment.findMany({
            where: {
                userId: session.user.id,
                status: 'PAID',
                paidAt: { gte: active.openTime }
            }
        })
        return { active, payments: payments.map(p => ({ ...p, amount: Number(p.amount) })) }
    }

    return { active: null, payments: [] }
}

export async function openRegister(formData: FormData) {
    const session = await getSession()
    if (!session) throw new Error("Unauthorized")

    const initialAmount = parseFloat(formData.get('initialAmount') as string)

    // Check if already open
    const existing = await prisma.cashRegister.findFirst({
        where: { userId: session.user.id, status: 'OPEN' }
    })
    if (existing) throw new Error("Caixa já está aberto")

    await prisma.cashRegister.create({
        data: {
            userId: session.user.id,
            initialAmount: isNaN(initialAmount) ? 0 : initialAmount,
            status: 'OPEN'
        }
    })

    revalidatePath('/finance/cash')
}

export async function closeRegister(id: number, formData: FormData) {
    const finalAmount = parseFloat(formData.get('finalAmount') as string)

    await prisma.cashRegister.update({
        where: { id },
        data: {
            status: 'CLOSED',
            closeTime: new Date(),
            finalAmount: isNaN(finalAmount) ? 0 : finalAmount
        }
    })
    revalidatePath('/finance/cash')
}

export async function addTransaction(registerId: number, formData: FormData) {
    const type = formData.get('type') as string // IN, OUT
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string

    await prisma.cashTransaction.create({
        data: {
            registerId,
            type,
            amount,
            description
        }
    })
    revalidatePath('/finance/cash')
}
