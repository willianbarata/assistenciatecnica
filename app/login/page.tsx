'use client'

import { login } from "./actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Link from "next/link"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

import { Navbar } from "@/components/Navbar"

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <LoginForm />
        </Suspense>
    )
}

function LoginForm() {
    const [error, setError] = useState("")
    const searchParams = useSearchParams()
    const type = searchParams.get("type")

    const title = type === 'client' ? "Área do Cliente" :
        type === 'seller' ? "Área do Parceiro" : "Bem-vindo de volta"

    async function handleSubmit(formData: FormData) {
        try {
            await login(formData)
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
                        <CardTitle className="text-2xl text-center text-white">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={handleSubmit} className="space-y-4">

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Email</label>
                                <Input name="email" type="email" placeholder="seu@email.com" required className="bg-slate-900 border-white/10 text-white" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Senha</label>
                                <Input name="password" type="password" placeholder="******" required className="bg-slate-900 border-white/10 text-white" />
                            </div>

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white" type="submit">
                                Entrar
                            </Button>

                            <div className="text-center text-sm text-gray-400">
                                {type === 'client' ? (
                                    <>
                                        Ainda não tem conta? <Link href="/signup-client" className="text-emerald-400 hover:underline">Cadastrar-se como Cliente</Link>
                                    </>
                                ) : (
                                    <>
                                        Quero ser parceiro? <Link href="/signup" className="text-blue-400 hover:underline">Criar loja</Link>
                                    </>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
