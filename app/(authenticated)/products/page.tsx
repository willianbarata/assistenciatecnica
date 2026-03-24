import { getProducts } from "./actions"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Plus, Package } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
    const products = await getProducts()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Estoque de Peças</h2>
                    <p className="text-muted-foreground">Gerencie seus produtos e peças</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/products/import">
                        <Button variant="outline">
                            <Plus className="mr-2 h-4 w-4" /> Importar CSV
                        </Button>
                    </Link>
                    <Link href="/products/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Nova Peça
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
                                <TableHead>Preço Venda</TableHead>
                                <TableHead>Custo</TableHead>
                                <TableHead>Estoque</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium text-white flex items-center">
                                        <Package className="mr-2 h-4 w-4 text-primary" />
                                        {product.name}
                                    </TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>R$ {Number(product.price).toFixed(2)}</TableCell>
                                    <TableCell className="text-slate-500">R$ {Number(product.cost).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span className={product.stock < 5 ? "text-red-500 font-bold" : "text-green-500"}>
                                            {product.stock} un
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/products/${product.id}/edit`}>
                                            <Button variant="ghost" size="sm">Editar</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">Nenhum produto cadastrado.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
