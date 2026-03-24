import { getMessages } from "./actions"
import { Card, CardContent } from "@/components/ui/Card"
import { MessageSquare, Phone, User } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
    const messages = await getMessages()

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                Mensagens de Interessados
            </h2>

            <div className="grid gap-4">
                {messages.length === 0 ? (
                    <div className="text-zinc-500">Nenhuma mensagem recebida ainda.</div>
                ) : (
                    messages.map((msg: any) => (
                        <Card key={msg.id} className="bg-zinc-900 border-zinc-800">
                            <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start">
                                {/* Image */}
                                {msg.productImage && (
                                    <div className="h-20 w-20 bg-zinc-800 rounded overflow-hidden shrink-0">
                                        <img src={msg.productImage} className="h-full w-full object-cover" />
                                    </div>
                                )}

                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white">Produto: {msg.productName}</h3>
                                            <div className="text-xs text-zinc-400">
                                                Recebido em: {new Date(Number(msg.createdAt)).toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <a href={`https://wa.me/${msg.visitorPhone.replace(/\D/g, '')}`} target="_blank" className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-1 transition-colors">
                                                <Phone className="h-3 w-3" /> Responder no WhatsApp
                                            </a>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-sm text-zinc-300 italic">
                                        "{msg.message}"
                                    </div>

                                    <div className="flex gap-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                        <div className="flex items-center gap-1">
                                            <User className="h-3 w-3" /> {msg.visitorName}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" /> {msg.visitorPhone}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
