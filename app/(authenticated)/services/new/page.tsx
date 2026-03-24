'use client'

import { createService } from "../actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewServicePage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/services">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-white">Novo Serviço</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalhes do Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createService} className="space-y-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">Nome do Serviço</label>
                            <Input id="name" name="name" placeholder="Ex: Troca de Tela" required />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                            <Input id="description" name="description" placeholder="Detalhes do serviço..." />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="price" className="text-sm font-medium">Preço Base (R$)</label>
                            <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" required />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg">Salvar Serviço</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
