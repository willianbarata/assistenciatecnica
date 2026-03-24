'use server'

import { prisma } from "@/lib/prisma" // We will create this singleton next to avoid multiple instances
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { login } from "@/lib/auth"

export async function signup(formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string
    const plan = formData.get("plan") as string || "FREE"

    if (!name || !email || !password || !phone) {
        throw new Error("Preencha todos os campos")
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({
        where: { email }
    })

    if (existing) {
        throw new Error("Email já cadastrado")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Admin Whitelist
    const adminEmails = ['willianbarata@gmail.com', 'willianbaratacat@gmail.com']
    const role = adminEmails.includes(email.toLowerCase()) ? 'ADMIN' : 'USER'

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            plan,
            role
        }
    })

    if (phone) {
        await prisma.$executeRaw`UPDATE "User" SET phone = ${phone} WHERE id = ${user.id}`
        // Update local object for login
        user.phone = phone
    }

    await login({ id: user.id, email: user.email, name: user.name, role: user.role })

    redirect("/dashboard")
}
