'use client'

import { createDevice } from "../../actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import React from 'react' // Import React for use

export default function NewDevicePage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use() if needed, or await in effect, but component is client. 
    // In Next 15+ Client Components, params is a promise but we typically just use passing props from server or standard unwrapping.
    // For simplicity, let's treat params as a Promise we need to look into.

    // Actually, in Client Components you receive params as a prop.
    const { id } = React.use(params)
    const clientId = parseInt(id)

    const createAction = createDevice.bind(null, clientId)

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href={`/clients/${clientId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-white">Novo Aparelho</h2>
            </div>

            <Card>
                <CardHeader><CardTitle>Cadastro de Equipamento</CardTitle></CardHeader>
                <CardContent>
                    <form action={createAction} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Marca</label>
                                <Input name="brand" placeholder="Ex: Samsung" required />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Modelo</label>
                                <Input name="model" placeholder="Ex: Galaxy S23" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">IMEI / Serial</label>
                                <Input name="imei" placeholder="Opcional" />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Cor</label>
                                <Input name="color" placeholder="Ex: Preto" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Estado de Conservação</label>
                            <Input name="condition" placeholder="Ex: Tela riscada, marcas de uso..." />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Acessórios Entregues</label>
                            <Input name="accessories" placeholder="Ex: Capa, Carregador, Chip" />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit">Salvar Aparelho</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
