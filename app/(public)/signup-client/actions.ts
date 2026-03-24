'use server'
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { login as createSession } from "@/lib/auth"

export async function registerClient(formData: FormData) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string

    if (!name || !email || !password || !phone) throw new Error("Preencha todos os campos")

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new Error("Email já cadastrado")

    const hashed = await bcrypt.hash(password, 10)

    // Use raw SQL because 'phone' might not be in generated Client
    const now = Date.now()
    await prisma.$executeRaw`
        INSERT INTO "User" (name, email, phone, password, role, plan, createdAt, updatedAt)
        VALUES (${name}, ${email}, ${phone}, ${hashed}, 'CLIENT', 'FREE', ${now}, ${now})
    `

    const users: any[] = await prisma.$queryRaw`SELECT id, email, name, role, phone FROM "User" WHERE email = ${email}`
    const user = users[0]

    await createSession({ id: user.id, email: user.email, name: user.name, role: "CLIENT", phone: user.phone })
    redirect("/portal")
}
