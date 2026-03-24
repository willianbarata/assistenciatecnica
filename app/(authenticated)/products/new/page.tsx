'use client'

import { createProduct } from "../actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewProductPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-white">Nova Peça / Produto</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalhes do Produto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createProduct} className="space-y-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">Nome da Peça</label>
                            <Input id="name" name="name" placeholder="Ex: Tela iPhone 11" required />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                            <Input id="description" name="description" placeholder="Marca, Modelo, Qualidade..." />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="price" className="text-sm font-medium">Preço Venda (R$)</label>
                                <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" required />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="cost" className="text-sm font-medium">Custo (R$)</label>
                                <Input id="cost" name="cost" type="number" step="0.01" placeholder="0.00" required />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="stock" className="text-sm font-medium">Estoque Inicial</label>
                                <Input id="stock" name="stock" type="number" placeholder="0" required />
                            </div>
                        </div>

                        {/* Marketplace Section */}
                        <div className="pt-4 border-t border-slate-800">
                            <div className="flex items-center space-x-2 mb-4">
                                <input type="checkbox" id="isPublic" name="isPublic" className="h-4 w-4 rounded border-gray-300" />
                                <label htmlFor="isPublic" className="text-sm font-bold text-white">Anunciar no Marketplace (Loja Online)</label>
                            </div>

                            <div className="grid gap-4 pl-6 border-l-2 border-slate-800">
                                <div className="grid gap-2">
                                    <label htmlFor="publicTitle" className="text-sm font-medium">Título do Anúncio</label>
                                    <Input id="publicTitle" name="publicTitle" placeholder="Ex: iPhone 11 Seminovo - Impecável" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Condição</label>
                                        <select name="condition" className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm">
                                            <option value="NEW">Novo / Lacrado</option>
                                            <option value="USED">Usado / Seminovo</option>
                                            <option value="REFURBISHED">Recondicionado</option>
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">URL da Imagem (Capa)</label>
                                        <Input id="imageUrl" name="imageUrl" placeholder="https://..." />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg">Salvar Produto</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
