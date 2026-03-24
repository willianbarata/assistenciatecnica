import { getProduct } from "./actions"
import { InquiryForm } from "./InquiryForm"
import { getSession } from "@/lib/auth"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, MessageCircle, Store } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ slug: string, productId: string }> }) {
    const { slug, productId } = await params
    const session = await getSession()
    const id = parseInt(productId)
    if (isNaN(id)) notFound()

    const product = await getProduct(id)
    if (!product) notFound()

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="bg-zinc-900 border-b border-zinc-800 p-6">
                <div className="max-w-5xl mx-auto">
                    <Link href={`/shop/${slug}`}>
                        <Button variant="link" className="text-zinc-400 pl-0 hover:text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Loja
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Images */}
                <div className="space-y-4">
                    <div className="aspect-square bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
                        {product.images[0] ? (
                            <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                            <Store className="h-24 w-24 text-zinc-700" />
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{product.publicTitle || product.name}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-400 font-medium">
                                {product.condition === 'NEW' ? 'Novo' : product.condition === 'USED' ? 'Usado' : 'Recondicionado'}
                            </span>
                        </div>
                    </div>

                    <div className="text-4xl font-bold text-white">
                        R$ {product.price.toFixed(2)}
                    </div>

                    <div className="prose prose-invert text-muted-foreground">
                        <p>{product.description || "Sem descrição detalhada."}</p>
                    </div>

                    <div className="pt-6 border-t border-zinc-800">
                        <p className="text-sm text-zinc-500 mb-4">Vendido por: <strong className="text-white">{product.user.name}</strong></p>
                        <a
                            href={`https://wa.me/${product.user.phone?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(`Olá, tenho interesse no produto "${product.publicTitle || product.name}" que vi no site.`)}`}
                            target="_blank"
                            className="block w-full"
                        >
                            <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">
                                <MessageCircle className="mr-2 h-5 w-5" />
                                Tenho Interesse (WhatsApp)
                            </Button>
                        </a>
                        <InquiryForm productId={product.id} user={session?.user} />
                    </div>
                </div>
            </main>
        </div>
    )
}
