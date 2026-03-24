'use client'

import { createClient } from "../actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

export default function NewClientPage() {
    const [address, setAddress] = useState({
        cep: '',
        street: '',
        neighborhood: '',
        city: '',
        state: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({ ...address, [e.target.name]: e.target.value })
    }

    async function handleCepBlur(e: React.FocusEvent<HTMLInputElement>) {
        const cep = e.target.value.replace(/\D/g, '')
        if (cep.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
                const data = await res.json()
                if (!data.erro) {
                    setAddress(prev => ({
                        ...prev,
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf,
                        cep: e.target.value // Keep user input format
                    }))
                }
            } catch (error) {
                console.error("Erro ao buscar CEP")
            }
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/clients">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-white">Novo Cliente</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Dados do Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createClient} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                                <Input id="name" name="name" placeholder="Ex: João da Silva" required />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="cpfOrCnpj" className="text-sm font-medium">CPF / CNPJ</label>
                                <Input id="cpfOrCnpj" name="cpfOrCnpj" placeholder="000.000.000-00" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <Input id="email" name="email" type="email" placeholder="joao@email.com" />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                                <Input id="phone" name="phone" placeholder="(11) 99999-9999" />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp</label>
                                <Input id="whatsapp" name="whatsapp" placeholder="(11) 99999-9999" />
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-white/10 pt-4">
                            <h3 className="font-semibold text-white">Endereço</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <label htmlFor="cep" className="text-sm font-medium">CEP</label>
                                    <Input
                                        id="cep"
                                        name="cep"
                                        placeholder="00000-000"
                                        value={address.cep}
                                        onChange={handleChange}
                                        onBlur={handleCepBlur}
                                    />
                                </div>
                                <div className="grid gap-2 col-span-2">
                                    <label htmlFor="street" className="text-sm font-medium">Logradouro</label>
                                    <Input
                                        id="street"
                                        name="street"
                                        placeholder="Rua..."
                                        value={address.street}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="grid gap-2 col-span-1">
                                    <label htmlFor="neighborhood" className="text-sm font-medium">Bairro</label>
                                    <Input
                                        id="neighborhood"
                                        name="neighborhood"
                                        placeholder="Centro"
                                        value={address.neighborhood}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid gap-2 col-span-2">
                                    <label htmlFor="city" className="text-sm font-medium">Cidade</label>
                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="São Paulo"
                                        value={address.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid gap-2 col-span-1">
                                    <label htmlFor="state" className="text-sm font-medium">Estado</label>
                                    <Input
                                        id="state"
                                        name="state"
                                        placeholder="SP"
                                        maxLength={2}
                                        value={address.state}
                                        onChange={handleChange}
                                        className="uppercase"
                                    />
                                </div>
                            </div>
                            <input type="hidden" name="address" value="" />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="notes" className="text-sm font-medium">Observações</label>
                            <Input id="notes" name="notes" placeholder="Ex: Cliente VIP, Horário comercial" />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg">Salvar Cliente</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
