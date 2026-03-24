import { getClient, getClientDevices } from "./actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Smartphone, Plus, History, User } from "lucide-react"
import Link from "next/link"
import DeviceList from "@/components/DeviceList"

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const clientId = parseInt(id)
    if (isNaN(clientId)) notFound()

    const client = await getClient(clientId)
    if (!client) notFound()

    const devices = await getClientDevices(clientId)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white">{client.name}</h1>
                    <p className="text-muted-foreground">{client.email} • {client.phone}</p>
                    <div className="flex gap-2 mt-2">
                        {client.cpfOrCnpj && <span className="bg-slate-800 text-xs px-2 py-1 rounded">CPF: {client.cpfOrCnpj}</span>}
                        {client.whatsapp && <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded">Validado WhatsApp</span>}
                    </div>
                </div>
                <Link href={`/orders/new?clientId=${client.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" /> Nova Ordem
                    </Button>
                </Link>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Col: Info & Notes */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-sm font-medium text-slate-400">
                                <User className="mr-2 h-4 w-4" /> Detalhes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <label className="text-muted-foreground block">Endereço</label>
                                <div className="text-white">{client.address || "Não informado"}</div>
                            </div>
                            <div>
                                <label className="text-muted-foreground block">Observações</label>
                                <div className="p-3 bg-slate-900/50 rounded-md text-slate-300 min-h-[80px]">
                                    {client.notes || "Sem observações."}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Col: Devices & History */}
                <div className="md:col-span-2 space-y-6">

                    {/* Devices Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="flex items-center text-lg font-medium">
                                <Smartphone className="mr-2 h-5 w-5 text-purple-500" />
                                Meus Aparelhos
                                <span className="ml-2 bg-slate-800 text-xs px-2 py-0.5 rounded-full">{devices.length}</span>
                            </CardTitle>
                            <Link href={`/clients/${client.id}/devices/new`}>
                                <Button size="sm" variant="outline">
                                    <Plus className="h-4 w-4" /> Adicionar
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <DeviceList devices={devices} clientId={client.id} />
                        </CardContent>
                    </Card>

                    {/* Order History (Placeholder for now) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg font-medium">
                                <History className="mr-2 h-5 w-5 text-blue-500" />
                                Histórico de Serviços
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">Mostrando últimas 5 ordens...</p>
                            {/* TODO: Reuse OrderList component filtered by client */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
