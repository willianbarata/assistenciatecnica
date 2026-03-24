'use client'

import { importServices } from "./actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowLeft, Download, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ImportServicesPage() {
    const [loading, setLoading] = useState(false)

    const downloadTemplate = () => {
        const header = "Nome,Descrição,Categoria,Preço\n"
        const rows = [
            "Troca de Tela iPhone X,Mão de obra especializada,Hardware,150.00",
            "Formatação Windows 11,Backup e Instalação,Software,120.00",
            "Limpeza Interna Notebook,Troca de pasta térmica,Manutenção,80.00",
            "Troca de Bateria Samsung,Serviço rápido,Hardware,60.00",
            "Recuperação de Dados,Análise lógica,Software,250.00",
            "Instalação Office,Pacote completo,Software,50.00",
            "Solda Conector Carga,Micro-soldagem,Hardware,100.00",
            "Banho Químico,Desoxidação de placa,Hardware,180.00",
            "Troca Teclado Macbook,Mão de obra complexa,Hardware,300.00",
            "Configuração Rede Wi-Fi,Visita técnica,Redes,150.00"
        ].join('\n')

        const blob = new Blob([header + rows], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'modelo_servicos.csv'
        a.click()
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/services">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-white">Importar Serviços em Massa</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>1. Baixar Modelo</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Baixe o arquivo modelo CSV abaixo. Ele contém colunas para Nome, Descrição, Categoria e Preço.
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
                    <form action={importServices} onSubmit={() => setLoading(true)} className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Selecione o arquivo .csv preenchido</label>
                            <Input name="file" type="file" accept=".csv" required />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                            {loading ? 'Importando...' : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" /> Importar Serviços
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
