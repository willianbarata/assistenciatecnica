import { getClientMessages } from "./actions"
import { Card, CardContent } from "@/components/ui/Card"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function PortalPage() {
    const messages = await getClientMessages()

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Minhas Mensagens Enviadas</h1>

            <div className="grid gap-4">
                {messages.length === 0 ? (
                    <div className="text-zinc-500 bg-zinc-900 p-8 rounded-lg text-center border border-zinc-800">
                        <p className="mb-4">Você ainda não enviou nenhuma mensagem.</p>
                        <Link href="/marketplace">
                            <span className="text-emerald-400 hover:underline cursor-pointer">Navegar no Marketplace</span>
                        </Link>
                    </div>
                ) : (
                    messages.map((msg: any) => (
                        <Card key={msg.id} className="bg-zinc-900 border-zinc-800 transition-colors hover:border-zinc-700">
                            <CardContent className="p-4 flex gap-4 items-start">
                                {msg.productImage && (
                                    <div className="h-20 w-20 bg-zinc-800 rounded shrink-0 overflow-hidden">
                                        <img src={msg.productImage} className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-lg">{msg.productName}</h3>
                                    <div className="text-sm text-zinc-400 mb-3">Vendedor: <span className="text-white">{msg.sellerName}</span></div>

                                    <div className="bg-black/40 p-3 rounded text-zinc-300 text-sm border border-zinc-800/50 italic relative">
                                        <div className="absolute -top-2 left-4 w-3 h-3 bg-zinc-900 border-l border-t border-zinc-800 rotate-45 transform"></div>
                                        "{msg.message}"
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="text-xs text-zinc-500">
                                            Enviado em: {new Date(Number(msg.createdAt)).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-1">
                                    <Link href={`/shop/${msg.sellerSlug || msg.sellerId}/product/${msg.pId}`} title="Ver Produto">
                                        <ExternalLink className="h-5 w-5 text-zinc-500 hover:text-emerald-400" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
