import { getClients } from "./actions"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Plus, Search, Upload } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
    const clients = await getClients()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Clientes</h2>
                    <p className="text-muted-foreground">Gerencie seus clientes</p>
                </div>
                <div>
                    <Link href="/clients/import">
                        <Button variant="outline" className="mr-2">
                            <Upload className="mr-2 h-4 w-4" /> Importar CSV
                        </Button>
                    </Link>
                    <Link href="/clients/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    {/* Future: Search Bar */}
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Endereço</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium text-white">{client.name}</TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell>{client.phone}</TableCell>
                                    <TableCell>{client.address}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Editar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {clients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">Nenhum cliente encontrado.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
