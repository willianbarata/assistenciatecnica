import { getOrders } from "./actions"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Plus, FileText, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

import { DateFilter } from "@/components/DateFilter"

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ startDate?: string; endDate?: string }> }) {
    const { startDate, endDate } = await searchParams
    const orders = await getOrders(startDate, endDate)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Ordens de Serviço</h2>
                    <p className="text-muted-foreground">Gerencie manutenções e reparos</p>
                </div>
                <div className="flex items-center gap-4">
                    <DateFilter />
                    <Link href="/orders/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Nova Ordem
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Aparelho</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                    <TableCell>{order.client.name}</TableCell>
                                    <TableCell>{order.device}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {order.status === 'COMPLETED' ? (
                                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                            ) : (
                                                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                            )}
                                            {order.status}
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right font-bold text-green-400">R$ {Number(order.total).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/orders/${order.id}`}>
                                            <Button variant="ghost" size="sm">Ver Detalhes</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24">Nenhuma ordem de serviço encontrada.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
