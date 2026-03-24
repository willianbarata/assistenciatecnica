import { getServices } from "./actions"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Plus, Wrench } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
    const services = await getServices()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Serviços / Mão de Obra</h2>
                    <p className="text-muted-foreground">Gerencie seus serviços oferecidos</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/services/import">
                        <Button variant="outline">
                            <Plus className="mr-2 h-4 w-4" /> Importar CSV
                        </Button>
                    </Link>
                    <Link href="/services/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Novo Serviço
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Preço Base</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium text-white flex items-center">
                                        <Wrench className="mr-2 h-4 w-4 text-primary" />
                                        {service.name}
                                    </TableCell>
                                    <TableCell>{service.description}</TableCell>
                                    <TableCell>R$ {Number(service.price).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Editar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {services.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">Nenhum serviço cadastrado.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
