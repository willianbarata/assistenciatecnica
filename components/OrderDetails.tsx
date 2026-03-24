'use client'

import { useState } from "react"
import { updateStatus, registerPayment, cancelOrder } from "@/app/(authenticated)/orders/[id]/actions"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { CheckCircle, Clock, CreditCard, DollarSign, FileText, Printer, Check, XCircle } from "lucide-react"
import Link from "next/link"

type Props = {
    order: any
}

export default function OrderDetails({ order }: Props) {
    const [loading, setLoading] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)

    // Payment State
    const [method, setMethod] = useState("CREDIT_CARD")
    const [installments, setInstallments] = useState(1)
    const [boletoUrl, setBoletoUrl] = useState("")

    const getStatusLabel = (s: string) => {
        const map: Record<string, string> = {
            'RECEBIDO': 'Recebido',
            'EM_ANALISE': 'Em Análise',
            'AGUARDANDO_APROVACAO': 'Aguardando Aprovação',
            'AGUARDANDO_PECA': 'Aguardando Peça',
            'EM_REPARO': 'Em Reparo',
            'PRONTO': 'Pronto',
            'ENTREGUE': 'Entregue',
            'COMPLETED': 'Finalizado',
            'CANCELLED': 'Cancelado'
        }
        return map[s] || s
    }

    const handleStatusChange = async (newStatus: string) => {
        setLoading(true)
        await updateStatus(order.id, newStatus)
        setLoading(false)
    }

    const handleCancel = async () => {
        if (!confirm("Tem certeza que deseja cancelar esta ordem? Ação irreversível.")) return
        setLoading(true)
        await cancelOrder(order.id)
        setLoading(false)
    }

    const handlePayment = async () => {
        setLoading(true)
        await registerPayment(order.id, {
            method,
            installments
        })
        setShowPaymentModal(false)
        setLoading(false)
    }

    const generateBoleto = () => {
        // Simulate Boleto Generation
        setBoletoUrl(`https://fake-boleto.com/pdf/${order.id}`)
    }

    const paidPayment = order.payments?.find((t: any) => t.status === 'PAID')

    return (
        <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-white">Ordem #{order.id}</h2>
                    <p className="text-muted-foreground">{order.client.name} - {order.device}</p>
                    <Link href="/orders" className="text-xs text-blue-400 hover:underline mt-1 inline-block">
                        &larr; Voltar para Ordens
                    </Link>
                </div>
                <div className="flex gap-2">
                    <Link href={`/orders/${order.id}/print`} target="_blank">
                        <Button variant="outline" className="mr-2">
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                        </Button>
                    </Link>
                    {order.status !== 'COMPLETED' ? (
                        <>
                            <Link href={`/orders/${order.id}/edit`}>
                                <Button variant="outline" className="mr-2">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Editar
                                </Button>
                            </Link>
                            <Button
                                onClick={() => handleStatusChange('COMPLETED')}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Concluir Serviço
                            </Button>
                            {order.status !== 'WAITING_PARTS' && (
                                <Button
                                    onClick={() => handleStatusChange('WAITING_PARTS')}
                                    disabled={loading}
                                    className="bg-yellow-600 hover:bg-yellow-700 ml-2"
                                >
                                    <Clock className="mr-2 h-4 w-4" />
                                    Aguardar Peça
                                </Button>
                            )}
                            <Button
                                onClick={handleCancel}
                                disabled={loading}
                                variant="destructive"
                                className="ml-2"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                        </>
                    ) : order.status === 'CANCELLED' ? (
                        <div className="text-red-500 font-bold border border-red-500 px-4 py-2 rounded-md">CANCELADO</div>
                    ) : (
                        !paidPayment && (
                            <Button
                                onClick={() => setShowPaymentModal(true)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <DollarSign className="mr-2 h-4 w-4" />
                                Registrar Pagamento
                            </Button>
                        )
                    )}
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Status</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center text-2xl font-bold">
                            {order.status === 'COMPLETED' ? (
                                <span className="text-green-500 flex items-center font-bold text-xl"><CheckCircle className="mr-2" /> Concluído</span>
                            ) : order.status === 'CANCELLED' ? (
                                <span className="text-red-500 flex items-center font-bold text-xl"><XCircle className="mr-2" /> Cancelado</span>
                            ) : (
                                <div className="flex flex-col">
                                    <span className="text-blue-400 font-bold mb-2">Status: {getStatusLabel(order.status)}</span>
                                    <select
                                        className="text-sm bg-slate-900 border border-slate-700 rounded p-1"
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        disabled={loading}
                                    >
                                        <option value="RECEBIDO">Recebido</option>
                                        <option value="EM_ANALISE">Em Análise</option>
                                        <option value="AGUARDANDO_APROVACAO">Aguardando Aprovação</option>
                                        <option value="AGUARDANDO_PECA">Aguardando Peça</option>
                                        <option value="EM_REPARO">Em Reparo</option>
                                        <option value="PRONTO">Pronto para Retirada</option>
                                        <option value="ENTREGUE">Entregue</option>
                                        <option value="COMPLETED">Finalizado/Pago</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* WhatsApp Button */}
                        <a
                            href={`https://wa.me/${order.client.phone?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(`Olá ${order.client.name}, sua ordem de serviço #${order.id} está: ${getStatusLabel(order.status)}.`)}`}
                            target="_blank"
                            className="mt-4 block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium"
                        >
                            Enviar atualização via WhatsApp
                        </a>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-400">R$ {order.total.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pagamento</CardTitle></CardHeader>
                    <CardContent>
                        {paidPayment ? (
                            <div className="text-green-500 flex flex-col">
                                <span className="font-bold flex items-center"><Check className="mr-2 h-4 w-4" /> PAGO</span>
                                <span className="text-xs text-muted-foreground">Via {paidPayment.method} em {new Date(paidPayment.paidAt).toLocaleDateString()}</span>
                            </div>
                        ) : (
                            <div className="text-red-400 font-bold">PENDENTE</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Items Table */}
            <Card>
                <CardHeader><CardTitle>Itens e Serviços</CardTitle></CardHeader>
                <CardContent>
                    <table className="w-full text-sm text-left">
                        <thead className="text-muted-foreground border-b">
                            <tr>
                                <th className="py-2">Item</th>
                                <th className="py-2">Qtd</th>
                                <th className="py-2 text-right">Preço Un.</th>
                                <th className="py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {order.items.map((item: any) => (
                                <tr key={item.id}>
                                    <td className="py-3">
                                        {item.product ? item.product.name : item.service.name}
                                        <span className="block text-xs text-muted-foreground">{item.product ? 'Peça' : 'Serviço'}</span>
                                    </td>
                                    <td className="py-3">{item.quantity}</td>
                                    <td className="py-3 text-right">R$ {item.unitPrice.toFixed(2)}</td>
                                    <td className="py-3 text-right font-medium">R$ {item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
            {/* History Log */}
            <Card>
                <CardHeader><CardTitle>Histórico de Alterações</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.history && order.history.length > 0 ? order.history.map((h: any) => (
                            <div key={h.id} className="flex justify-between items-start border-b border-slate-800 pb-2">
                                <div>
                                    <p className="font-medium text-white">{getStatusLabel(h.status)}</p>
                                    <p className="text-xs text-muted-foreground">{h.notes}</p>
                                    <p className="text-xs text-slate-500">por {h.user?.name || 'Sistema'}</p>
                                </div>
                                <div className="text-xs text-slate-400">
                                    {new Date(h.createdAt).toLocaleString()}
                                </div>
                            </div>
                        )) : (
                            <p className="text-muted-foreground text-sm">Nenhum histórico registrado.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Payment Modal Overlay */}
            {
                showPaymentModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle>Registrar Pagamento</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Método de Pagamento</label>
                                    <select
                                        className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700"
                                        value={method}
                                        onChange={e => setMethod(e.target.value)}
                                    >
                                        <option value="CREDIT_CARD">Cartão de Crédito</option>
                                        <option value="DEBIT_CARD">Cartão de Débito</option>
                                        <option value="PIX">PIX</option>
                                        <option value="CASH">Dinheiro</option>
                                        <option value="BOLETO">Boleto Bancário</option>
                                    </select>
                                </div>

                                {method === 'CREDIT_CARD' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Parcelas</label>
                                        <select
                                            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-700"
                                            value={installments}
                                            onChange={e => setInstallments(Number(e.target.value))}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 10, 12].map(i => (
                                                <option key={i} value={i}>{i}x de R$ {(order.total / i).toFixed(2)}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {method === 'BOLETO' && (
                                    <div className="space-y-2 p-4 bg-zinc-800 rounded-md text-center">
                                        {!boletoUrl ? (
                                            <Button variant="outline" onClick={generateBoleto} className="w-full">
                                                <FileText className="mr-2 h-4 w-4" /> Gerar Boleto
                                            </Button>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-green-400 text-sm font-bold">Boleto Gerado com Sucesso!</p>
                                                <div className="text-xs text-muted-foreground break-all p-2 bg-black rounded">
                                                    {boletoUrl}
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => window.open(boletoUrl, '_blank')}>
                                                    <Printer className="mr-2 h-4 w-4" /> Imprimir
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2 pt-4 justify-end">
                                    <Button variant="ghost" onClick={() => setShowPaymentModal(false)}>Cancelar</Button>
                                    <Button onClick={handlePayment} disabled={loading} className="bg-green-600 hover:bg-green-700">
                                        Confirmar Recebimento
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )
            }
        </div >
    )
}
