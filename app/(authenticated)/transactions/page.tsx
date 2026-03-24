import { getPayments, getFinanceStats } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { CheckCircle, Clock, XCircle, CreditCard, Banknote, FileText, AlertCircle } from "lucide-react"

export const dynamic = 'force-dynamic'

import { DateFilter } from "@/components/DateFilter"

export default async function TransactionsPage({ searchParams }: { searchParams: Promise<{ startDate?: string; endDate?: string }> }) {
    const { startDate, endDate } = await searchParams
    const payments = await getPayments(startDate, endDate)
    const stats = await getFinanceStats()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white gap-2 flex items-center">
                    Financeiro
                </h2>
                <DateFilter />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Recebido (Pago)</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-400">R$ {stats.received.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">A Receber (Concluído)</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">R$ {stats.pending.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Serviços prontos, aguardando pagamento</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Em Aberto (Produção)</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-400">R$ {stats.open.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Serviços em andamento</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Histórico de Pagamentos</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Cliente / Ordem</TableHead>
                                <TableHead>Método</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((t: any) => (
                                <TableRow key={t.id}>
                                    <TableCell>#{t.id}</TableCell>
                                    <TableCell>{t.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{t.order.client.name}</span>
                                            <span className="text-xs text-muted-foreground">Ordem #{t.orderId}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {t.method === 'PIX' && <span className="font-bold text-emerald-400">PIX</span>}
                                            {t.method === 'CREDIT_CARD' && <span className="flex items-center"><CreditCard className="w-4 h-4 mr-1" /> Cartão</span>}
                                            {t.method === 'CASH' && <span className="flex items-center"><Banknote className="w-4 h-4 mr-1" /> Dinheiro</span>}
                                            {t.method === 'BOLETO' && <span className="flex items-center"><FileText className="w-4 h-4 mr-1" /> Boleto</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {t.status === 'PAID' && <span className="text-green-500 flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Pago</span>}
                                        {t.status === 'PENDING' && <span className="text-yellow-500 flex items-center"><Clock className="w-4 h-4 mr-1" /> Pendente</span>}
                                    </TableCell>
                                    <TableCell className="text-right font-bold">R$ {t.amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
