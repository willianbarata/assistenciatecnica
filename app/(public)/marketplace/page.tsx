import { getMarketplaceProducts } from "./actions"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { ShoppingBag, Store } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function MarketplacePage() {
    const products = await getMarketplaceProducts()

    return (
        <div className="min-h-screen bg-black">
            {/* Public Header */}
            <header className="border-b border-zinc-800 bg-zinc-900/50 p-4 sticky top-0 backdrop-blur-md z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between text-white">
                    <div className="flex items-center font-bold text-xl">
                        <ShoppingBag className="mr-2 text-purple-500" />
                        Marketplace Técnico
                    </div>
                    <div className="flex gap-2">
                        <Link href="/tracking">
                            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">Rastrear OS</Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Sou Lojista (Login)</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 space-y-8">
                <div className="text-center py-10">
                    <h1 className="text-5xl font-extrabold pb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Encontre Peças e Aparelhos
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Anúncios de assistências técnicas verificadas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-purple-500/50 transition-colors">
                            <div className="h-48 bg-zinc-800 flex items-center justify-center">
                                {product.images[0] ? (
                                    <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                                ) : (
                                    <Store className="h-12 w-12 text-zinc-700" />
                                )}
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-white text-lg truncate">{product.publicTitle || product.name}</CardTitle>
                                <p className="text-xs text-muted-foreground">{product.condition === 'NEW' ? 'Novo' : 'Usado'}</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-white">R$ {product.price.toFixed(2)}</p>
                                <p className="text-xs text-slate-400 mt-2 truncate">Vendido por: {product.user.name}</p>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/shop/${product.user.slug || product.userId}`} className="w-full">
                                    <Button className="w-full bg-slate-800 hover:bg-slate-700">Ver Loja</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-full text-center py-20 text-muted-foreground">
                            Nenhum item anunciado no momento.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
