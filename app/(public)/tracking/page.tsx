'use client'
import { useState } from "react"
import Link from "next/link"
import { checkOrderStatus } from "./actions"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Search, CheckCircle, Clock, ArrowLeft } from "lucide-react"

export default function TrackingPage() {
    const [searchId, setSearchId] = useState("")
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        if (!searchId) return

        setLoading(true)
        setError("")
        setResult(null)

        try {
            const idText = searchId.replace(/\D/g, '')
            if (!idText) throw new Error("ID inválido")
            const id = parseInt(idText)

            const res = await checkOrderStatus(id)
            if (res) {
                setResult(res)
            } else {
                setError("Ordem de serviço não encontrada.")
            }
        } catch (err) {
            setError("Erro ao buscar. Verifique o número.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative">
            <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8">
                <Button variant="ghost" className="text-zinc-400 hover:text-white gap-2">
                    <ArrowLeft className="h-4 w-4" /> Voltar para o Início
                </Button>
            </Link>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Rastreio de Serviço</h1>
                    <p className="text-zinc-400">Consulte o status do seu aparelho</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                placeholder="Nº da Ordem (Ex: 123)"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="bg-black border-zinc-700 text-white"
                                type="number"
                            />
                            <Button type="submit" disabled={loading}>
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {error && (
                    <div className="text-red-400 text-center text-sm bg-red-950/20 p-2 rounded animate-in fade-in">
                        {error}
                    </div>
                )}

                {result && (
                    <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 animate-in slide-in-from-bottom-4">
                        <CardHeader className="border-b border-zinc-800 pb-3">
                            <CardTitle className="flex items-center justify-between text-white">
                                <span>OS #{result.id}</span>
                                <span className={`text-sm px-2 py-1 rounded-full ${result.status === 'PRONTO' || result.status === 'ENTREGUE'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {result.status}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 font-medium bg-zinc-800/50 px-2 py-0.5 rounded">Aparelho</label>
                                <div className="text-white font-medium mt-1">{result.device}</div>
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 font-medium bg-zinc-800/50 px-2 py-0.5 rounded">Cliente</label>
                                <div className="text-white mt-1">{result.clientName}</div>
                            </div>
                            {result.exitDate ? (
                                <div>
                                    <label className="text-xs text-zinc-500 font-medium bg-zinc-800/50 px-2 py-0.5 rounded">Saída</label>
                                    <div className="text-white mt-1">{new Date(result.exitDate).toLocaleDateString()}</div>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-xs text-zinc-500 font-medium bg-zinc-800/50 px-2 py-0.5 rounded">Entrada</label>
                                    <div className="text-white mt-1">{new Date(result.entryDate).toLocaleDateString()}</div>
                                </div>
                            )}

                            {result.status === 'PRONTO' && (
                                <div className="bg-green-500/10 border border-green-500/20 rounded p-3 flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-green-400">Pronto para retirada!</div>
                                        <div className="text-xs text-green-300/70 mt-1">
                                            Seu aparelho já pode ser buscado na loja.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {result.status !== 'PRONTO' && result.status !== 'ENTREGUE' && (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3 flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-blue-400">Em andamento</div>
                                        <div className="text-xs text-blue-300/70 mt-1">
                                            Estamos cuidando do seu aparelho.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
