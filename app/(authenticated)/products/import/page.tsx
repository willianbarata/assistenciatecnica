'use client'

import { importProducts } from "./actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowLeft, Download, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ImportProductsPage() {
    const [loading, setLoading] = useState(false)

    const downloadTemplate = () => {
        const header = "Nome,Descrição,Preço Venda,Custo,Estoque\n"
        const rows = [
            "Tela iPhone 11,Qualidade Premium,350.00,150.00,10",
            "Bateria Samsung S20,Original,200.00,80.00,5",
            "Película de Vidro 3D,Universal,30.00,5.00,50",
            "Cabo Lightning,Homologado Apple,80.00,25.00,20",
            "Carregador Turbo,20W USB-C,120.00,45.00,15",
            "Fone de Ouvido Bluetooth,Similar AirPods,150.00,60.00,8",
            "Capa Protetora Transparente,Silicone Reforçado,40.00,8.00,30",
            "Conector de Carga Moto G8,Placa Original,90.00,35.00,3",
            "Display Xiaomi Note 10,OLED,450.00,280.00,4",
            "Pasta Térmica Prata,Seringa 10g,25.00,10.00,12"
        ].join('\n')

        const blob = new Blob([header + rows], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'modelo_importacao.csv'
        a.click()
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-white">Importar Produtos em Massa</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>1. Baixar Modelo</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Baixe o arquivo modelo CSV abaixo. Ele contém colunas para Nome, Descrição, Preço, Custo e Estoque.
                        Recomendamos não alterar o cabeçalho.
                    </p>
                    <Button onClick={downloadTemplate} variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Baixar Modelo CSV (com 10 exemplos)
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>2. Enviar Arquivo</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={importProducts} onSubmit={() => setLoading(true)} className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Selecione o arquivo .csv preenchido</label>
                            <Input name="file" type="file" accept=".csv" required />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                            {loading ? 'Importando...' : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" /> Importar Produtos
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
