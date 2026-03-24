'use client'

import { signup } from "./actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Link from "next/link"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

import { Navbar } from "@/components/Navbar"

export default function SignupPage() {
    const searchParams = useSearchParams()
    const plan = searchParams.get('plan') || 'FREE'
    const [error, setError] = useState("")

    async function handleSubmit(formData: FormData) {
        try {
            await signup(formData)
        } catch (e: any) {
            setError(e.message)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-white/10">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center text-white">Crie sua conta</CardTitle>
                        <p className="text-center text-gray-400 text-sm">Plano selecionado: <span className="text-blue-400 font-bold uppercase">{plan}</span></p>
                    </CardHeader>
                    <CardContent>
                        <form action={handleSubmit} className="space-y-4">
                            <input type="hidden" name="plan" value={plan} />

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Nome da Assistência</label>
                                <Input name="name" placeholder="Ex: TechCell Reparos" required className="bg-slate-900 border-white/10 text-white" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">WhatsApp (com DDD)</label>
                                <Input name="phone" placeholder="Ex: 11999999999" required className="bg-slate-900 border-white/10 text-white" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Email</label>
                                <Input name="email" type="email" placeholder="seu@email.com" required className="bg-slate-900 border-white/10 text-white" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Senha</label>
                                <Input name="password" type="password" placeholder="******" required minLength={6} className="bg-slate-900 border-white/10 text-white" />
                            </div>

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white" type="submit">
                                Cadastrar
                            </Button>

                            <div className="text-center text-sm text-gray-400">
                                Já tem uma conta? <Link href="/login" className="text-blue-400 hover:underline">Fazer Login</Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

