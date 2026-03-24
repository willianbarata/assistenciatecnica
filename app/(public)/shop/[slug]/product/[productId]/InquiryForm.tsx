'use client'
import { useState } from "react"
import { sendInquiry } from "./actions"
import { Button } from "@/components/ui/Button"
import { MessageSquare } from "lucide-react"
import Link from "next/link"

export function InquiryForm({ productId, user }: { productId: number, user?: any }) {
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            await sendInquiry(formData)
            setSent(true)
        } catch (e: any) {
            alert("Erro: " + e.message)
        } finally {
            setLoading(false)
        }
    }

    if (sent) return (
        <div className="bg-green-500/10 p-4 rounded-lg text-green-400 text-center animate-in fade-in mt-4 border border-green-500/20">
            <h3 className="font-bold">Mensagem Enviada!</h3>
            <p className="text-sm">Você pode acompanhar a resposta no seu portal.</p>
            <Link href="/portal">
                <Button variant="ghost" size="sm" className="mt-2 text-green-400 hover:text-green-300 hover:bg-green-500/20">Ir para Minhas Mensagens</Button>
            </Link>
        </div>
    )

    if (!user) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4 mt-6">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Enviar Mensagem ao Vendedor
                </h3>
                <p className="text-zinc-400 text-sm">Para enviar mensagens sobre este produto, é necessário identificar-se.</p>
                <div className="flex flex-col gap-3">
                    <Link href="/signup-client" className="w-full">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                            Enviar mensagem - Cadastre-se
                        </Button>
                    </Link>
                    <div className="text-center text-xs text-zinc-500">
                        Já tem cadastro? <Link href="/login" className="text-emerald-400 hover:underline">Entrar</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4 mt-6">
            <h3 className="text-white font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Enviar Mensagem
            </h3>

            <form action={handleSubmit} className="space-y-3">
                <input type="hidden" name="productId" value={productId} />

                <div className="bg-black/40 p-3 rounded border border-zinc-800/50 text-sm">
                    <div className="text-zinc-500 mb-1 text-xs uppercase tracking-wide">Seus dados de contato (automático)</div>
                    <div className="text-white flex flex-col md:flex-row md:gap-6 gap-1 font-medium">
                        <span>{user.name}</span>
                        <span className="text-zinc-400">{user.phone}</span>
                    </div>
                </div>

                <textarea
                    name="message"
                    placeholder="Olá, tenho interesse neste produto. Está disponível?"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md p-3 text-sm text-white h-24 resize-none focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                ></textarea>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Mensagem"}
                </Button>
            </form>
        </div>
    )
}
