import { getAdminData, updateUser } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge" // Assuming I might need to create this or use standard HTML
import { ShieldAlert, Users, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/Button"

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const users = await getAdminData()

    if (!users) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <ShieldAlert className="h-16 w-16 text-red-500" />
                <h2 className="text-2xl font-bold text-white">Acesso Negado</h2>
                <p className="text-muted-foreground">Esta área é restrita a administradores do sistema.</p>

                {/* Dev Tool to Promote Self */}
                <form action={makeMeAdmin}>
                    <Button variant="outline" className="mt-4 border-red-500 text-red-400 hover:bg-red-500/10">
                        [DEV] Tornar-me Admin
                    </Button>
                </form>
            </div>
        )
    }

    const totalUsers = users.length
    const totalActive = users.filter((u: any) => u.stats.orders > 0).length
    const totalEnterprise = users.filter((u: any) => u.plan === 'ENTERPRISE').length

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-white gap-2 flex items-center">
                <LayoutDashboard className="h-8 w-8 text-purple-500" />
                Painel do Administrador
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total de Tenantes</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{totalUsers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Tenantes Ativos</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-400">{totalActive}</div>
                        <p className="text-xs text-muted-foreground">Com pelo menos 1 ordem</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Planos Enterprise</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-400">{totalEnterprise}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Usuários Cadastrados (Tenantes)</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nome / Email</TableHead>
                                <TableHead>Plano</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Uso (Clientes/Ordens)</TableHead>
                                <TableHead>Data Cadastro</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u: any) => (
                                <TableRow key={u.id}>
                                    <TableCell>#{u.id}</TableCell>
                                    <TableCell>
                                        <div className="font-medium text-white">{u.name}</div>
                                        <div className="text-xs text-muted-foreground">{u.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <form action={updateUser.bind(null, u.id)} className="flex items-center gap-2">
                                            <select
                                                name="plan"
                                                defaultValue={u.plan}
                                                className="bg-zinc-900 border border-zinc-700 text-xs rounded px-2 py-1 text-white"
                                            >
                                                <option value="FREE">Free</option>
                                                <option value="PRO">Pro</option>
                                                <option value="ENTERPRISE">Enterprise</option>
                                            </select>
                                            <input type="hidden" name="role" value={u.role} />
                                            <Button type="submit" size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-green-900/50 hover:text-green-400">
                                                <LayoutDashboard className="h-3 w-3" />
                                            </Button>
                                        </form>
                                    </TableCell>
                                    <TableCell>{u.role}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 text-xs">
                                            <span className="flex items-center"><Users className="w-3 h-3 mr-1" /> {u.stats.clients}</span>
                                            <span className="flex items-center"><LayoutDashboard className="w-3 h-3 mr-1" /> {u.stats.orders}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
