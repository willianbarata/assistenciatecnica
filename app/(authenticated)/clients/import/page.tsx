'use client'

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { importClients } from "./actions"
import { Download, Upload } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ImportClientsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            const res = await importClients(formData)
            if (res.success) {
                alert(`Importação concluída! ${res.count} clientes importados.`)
                router.push('/clients')
            }
        } catch (error) {
            console.error(error)
            alert("Erro ao importar arquivos")
        } finally {
            setLoading(false)
        }
    }

    const downloadTemplate = () => {
        const header = "name,cpfOrCnpj,email,phone,whatsapp,cep,logradouro,bairro,cidade,estado,notes"
        const example = "João da Silva,11122233344,joao@email.com,11999998888,11999998888,01001000,Praça da Sé,Sé,São Paulo,SP,Cliente VIP"
        const csvContent = "data:text/csv;charset=utf-8," + header + "\n" + example
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "template_clientes.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-white">Importar Clientes</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Upload CSV</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-400">Baixe o modelo para preencher seus dados corretamente. Separe o endereço em colunas (Logradouro, Bairro, Cidade, Estado, CEP).</p>
                        <Button variant="outline" onClick={downloadTemplate} type="button" className="w-full">
                            <Download className="mr-2 h-4 w-4" /> Baixar Modelo CSV
                        </Button>
                    </div>

                    <div className="border-t border-white/10 my-4" />

                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Selecione o arquivo CSV</label>
                            <Input type="file" name="file" accept=".csv" required className="cursor-pointer" />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Importando..." : <>
                                <Upload className="mr-2 h-4 w-4" /> Importar Clientes
                            </>}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
