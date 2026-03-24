import { getProduct, updateProduct } from "../../actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const productId = parseInt(id)
    if (isNaN(productId)) notFound()

    const product = await getProduct(productId)
    if (!product) notFound()

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-white">Editar Peça / Produto</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalhes do Produto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={updateProduct.bind(null, productId)} className="space-y-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">Nome da Peça</label>
                            <Input id="name" name="name" defaultValue={product.name} required />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                            <Input id="description" name="description" defaultValue={product.description || ''} />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="price" className="text-sm font-medium">Preço Venda (R$)</label>
                                <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="cost" className="text-sm font-medium">Custo (R$)</label>
                                <Input id="cost" name="cost" type="number" step="0.01" defaultValue={product.cost} required />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="stock" className="text-sm font-medium">Estoque</label>
                                <Input id="stock" name="stock" type="number" defaultValue={product.stock} required />
                            </div>
                        </div>

                        {/* Marketplace Section */}
                        <div className="pt-4 border-t border-slate-800">
                            <div className="flex items-center space-x-2 mb-4">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    name="isPublic"
                                    className="h-4 w-4 rounded border-gray-300"
                                    defaultChecked={product.isPublic}
                                />
                                <label htmlFor="isPublic" className="text-sm font-bold text-white">Anunciar no Marketplace</label>
                            </div>

                            <div className="grid gap-4 pl-6 border-l-2 border-slate-800">
                                <div className="grid gap-2">
                                    <label htmlFor="publicTitle" className="text-sm font-medium">Título do Anúncio</label>
                                    <Input id="publicTitle" name="publicTitle" defaultValue={product.publicTitle || ''} placeholder="Ex: iPhone 11 Seminovo" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Condição</label>
                                        <select
                                            name="condition"
                                            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                                            defaultValue={product.condition || 'USED'}
                                        >
                                            <option value="NEW">Novo / Lacrado</option>
                                            <option value="USED">Usado / Seminovo</option>
                                            <option value="REFURBISHED">Recondicionado</option>
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">URL da Imagem (Capa)</label>
                                        <Input
                                            id="imageUrl"
                                            name="imageUrl"
                                            placeholder="https://..."
                                            defaultValue={product.images && product.images[0] ? product.images[0].url : ''}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg">Salvar Alterações</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
