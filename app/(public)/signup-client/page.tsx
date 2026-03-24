'use client'
import { useState } from "react"
import { registerClient } from "./actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ClientSignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError("")
        try {
            await registerClient(formData)
        } catch (e: any) {
            setError(e.message)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg p-8">
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </button>
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Cadastro de Cliente</h1>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-zinc-400 block mb-1">Nome Completo</label>
                        <Input name="name" className="bg-zinc-950 border-zinc-800 text-white" required placeholder="Seu Nome" />
                    </div>
                    <div>
                        <label className="text-sm text-zinc-400 block mb-1">Email</label>
                        <Input name="email" type="email" className="bg-zinc-950 border-zinc-800 text-white" required placeholder="seu@email.com" />
                    </div>
                    <div>
                        <label className="text-sm text-zinc-400 block mb-1">WhatsApp / Telefone</label>
                        <Input name="phone" className="bg-zinc-950 border-zinc-800 text-white" required placeholder="(11) 99999-9999" />
                    </div>
                    <div>
                        <label className="text-sm text-zinc-400 block mb-1">Senha</label>
                        <Input name="password" type="password" className="bg-zinc-950 border-zinc-800 text-white" required />
                    </div>

                    {error && <div className="text-red-400 text-sm bg-red-950/20 p-2 rounded">{error}</div>}

                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
                        {loading ? "Criando Conta..." : "Criar Conta"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-zinc-500">
                    Já tem conta? <Link href="/login" className="text-emerald-400 hover:underline">Fazer Login</Link>
                </div>
            </div>
        </div>
    )
}
