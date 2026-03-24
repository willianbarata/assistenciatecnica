import { getDashboardStats } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { DollarSign, TrendingUp, TrendingDown, ClipboardList, AlertTriangle } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard Dashboard</h2>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-400">R$ {stats.revenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Em serviços concluídos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-400">R$ {stats.profit.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Após desconto de peças</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Custo de Peças</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-400">R$ {stats.cost.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Peças utilizadas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ordens Ativas</CardTitle>
                        <ClipboardList className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.activeOrders}</div>
                        <p className="text-xs text-muted-foreground">Em andamento / Aberte</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Orders - Takes 4 cols */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Ordens Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentOrders.map(order => (
                                <div key={order.id} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none text-white">{order.client.name}</p>
                                        <p className="text-xs text-muted-foreground">{order.device} - {order.status}</p>
                                    </div>
                                    <div className="font-medium text-green-400">
                                        R$ {Number(order.total).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Low Stock - Takes 3 cols */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Alerta de Estoque</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.lowStock.map(product => (
                                <div key={product.id} className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <div className="flex items-center space-x-4">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        <div>
                                            <p className="text-sm font-medium leading-none text-white">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">Reposicionar urgente</p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-red-500">
                                        {product.stock} un
                                    </div>
                                </div>
                            ))}
                            {stats.lowStock.length === 0 && (
                                <p className="text-sm text-green-500">Estoque está saudável!</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
