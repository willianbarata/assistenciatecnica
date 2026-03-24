'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { login as createSession } from "@/lib/auth"

export async function login(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        throw new Error("Preencha todos os campos")
    }

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        throw new Error("Credenciais Inválidas")
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
        throw new Error("Credenciais Inválidas")
    }

    await createSession({ id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone || "" })

    if (user.role === 'CLIENT') {
        redirect("/portal")
    } else {
        redirect("/dashboard")
    }
}
