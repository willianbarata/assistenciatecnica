import { getCashRegister, openRegister, closeRegister, addTransaction } from "./actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowLeft, DollarSign, Lock, Unlock, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function CashRegisterPage() {
    const data = await getCashRegister()
    const isOpen = !!data?.active

    // Calculate Totals
    let totalIn = 0
    let totalOut = 0
    let totalSales = 0

    if (isOpen && data) {
        // Active transactions
        data.active.transactions.forEach((t: any) => {
            if (t.type === 'IN') totalIn += Number(t.amount)
            if (t.type === 'OUT') totalOut += Number(t.amount)
        })

        // Sales (Payments)
        data.payments.forEach((p: any) => {
            totalSales += p.amount
        })
    }

    const currentBalance = isOpen && data ? (Number(data.active.initialAmount) + totalIn + totalSales - totalOut) : 0

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Fluxo de Caixa</h1>
                        <p className="text-muted-foreground">Controle de entradas e saídas diárias</p>
                    </div>
                </div>
                {isOpen ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-900/40 border border-green-800 rounded-md text-green-400">
                        <Unlock className="h-4 w-4" />
                        <span className="font-bold">CAIXA ABERTO</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-900/40 border border-red-800 rounded-md text-red-400">
                        <Lock className="h-4 w-4" />
                        <span className="font-bold">CAIXA FECHADO</span>
                    </div>
                )}
            </div>

            {!isOpen ? (
                <Card className="max-w-md mx-auto mt-10">
                    <CardHeader><CardTitle>Abertura de Caixa</CardTitle></CardHeader>
                    <CardContent>
                        <form action={openRegister} className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Fundo de Troco (R$)</label>
                                <Input name="initialAmount" type="number" step="0.01" placeholder="0.00" autoFocus />
                            </div>
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Abrir Caixa</Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Saldo Atual em Caixa</CardTitle></CardHeader>
                            <CardContent>
                                <div className="text-5xl font-bold text-white mb-2">R$ {currentBalance.toFixed(2)}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-4">
                                    <span>Inicial: R$ {Number(data?.active.initialAmount).toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-emerald-900/20 border-emerald-900">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">Vendas Hoje</p>
                                        <p className="text-2xl font-bold text-emerald-400">+ R$ {totalSales.toFixed(2)}</p>
                                    </div>
                                    <DollarSign className="h-8 w-8 text-emerald-600 opacity-50" />
                                </CardContent>
                            </Card>
                            <Card className="bg-red-900/20 border-red-900">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase">Sangrias / Saídas</p>
                                        <p className="text-2xl font-bold text-red-400">- R$ {totalOut.toFixed(2)}</p>
                                    </div>
                                    <ArrowDownCircle className="h-8 w-8 text-red-600 opacity-50" />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Close Register */}
                        <Card className="border-red-900/50">
                            <CardHeader><CardTitle className="text-red-400">Fechar Caixa</CardTitle></CardHeader>
                            <CardContent>
                                <form action={closeRegister.bind(null, data!.active.id)} className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="text-sm font-medium">Valor Conferido</label>
                                        <Input name="finalAmount" type="number" step="0.01" placeholder="0.00" required />
                                    </div>
                                    <Button type="submit" variant="destructive">Encerrar Dia</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Actions & History */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Movimentação Manual</CardTitle></CardHeader>
                            <CardContent>
                                <form action={addTransaction.bind(null, data!.active.id)} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Tipo</label>
                                            <select name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                <option value="OUT">Sangria (Retirada)</option>
                                                <option value="IN">Suprimento (Entrada)</option>
                                            </select>
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Valor</label>
                                            <Input name="amount" type="number" step="0.01" required />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Descrição / Motivo</label>
                                        <Input name="description" placeholder="Ex: Pagamento Motoboy" required />
                                    </div>
                                    <Button type="submit" variant="secondary" className="w-full">Registrar Movimento</Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Recent Transactions List */}
                        <Card>
                            <CardHeader><CardTitle>Extrato do Dia</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {data!.active.transactions.map((t: any) => (
                                        <div key={t.id} className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
                                            <span>{t.description}</span>
                                            <span className={t.type === 'IN' ? 'text-green-400' : 'text-red-400'}>
                                                {t.type === 'IN' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                    {/* Show recent payments too */}
                                    {data!.payments.map((p: any) => (
                                        <div key={`p-${p.id}`} className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
                                            <span>Pagamento OS #{p.orderId}</span>
                                            <span className="text-green-400">+ R$ {p.amount.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
