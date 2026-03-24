import { getShop } from "./actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowLeft, MessageCircle, Store } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const shop = await getShop(slug)
    if (!shop) notFound()

    const { user, products } = shop

    return (
        <div className="min-h-screen bg-black">
            {/* Shop Header */}
            <header className="bg-zinc-900 border-b border-zinc-800 p-6">
                <div className="max-w-5xl mx-auto">
                    <Link href="/marketplace">
                        <Button variant="link" className="text-zinc-400 pl-0 mb-4 hover:text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Marketplace
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                            <Store className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                            <p className="text-muted-foreground">Loja de Peças e Aparelhos</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map(product => (
                        <Card key={product.id} className="bg-zinc-900 border-zinc-800">
                            <div className="h-48 bg-zinc-800 flex items-center justify-center relative group">
                                <Link href={`/shop/${slug}/product/${product.id}`} className="absolute inset-0 z-10" />
                                {product.images[0] ? (
                                    <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <Store className="h-12 w-12 text-zinc-700" />
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle className="text-white">{product.publicTitle || product.name}</CardTitle>
                                <p className="text-xs text-muted-foreground">{product.condition === 'NEW' ? 'Novo' : 'Usado'}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-xl font-bold text-white">R$ {product.price.toFixed(2)}</p>
                                <Link href={`/shop/${slug}/product/${product.id}`} className="block w-full">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        Visualizar Detalhes
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-full text-center py-20 text-muted-foreground">
                            Esta loja não possui itens ativos no momento.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
