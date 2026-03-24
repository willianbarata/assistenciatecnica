'use client'

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { updateSlug } from "./actions"
import { useState } from "react"
import { ExternalLink } from "lucide-react"

export function SlugForm({ initialSlug }: { initialSlug: string }) {
    const [loading, setLoading] = useState(false)
    const [currentSlug, setCurrentSlug] = useState(initialSlug)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError("")
        setSuccess(false)
        try {
            const res = await updateSlug(formData)
            if (res.success) {
                setSuccess(true)
                if (res.slug) setCurrentSlug(res.slug)
                setTimeout(() => setSuccess(false), 3000)
            }
        } catch (error: any) {
            console.error(error)
            setError(error.message || "Erro ao atualizar URL")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-2 pt-2 border-t border-white/10 mt-4">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-muted-foreground">URL Personalizada (Nome da Loja)</label>
                <div className="text-xs text-zinc-500">Ex: minha-loja</div>
            </div>
            <div className="flex gap-2 items-center">
                <div className="text-sm text-zinc-500 font-mono hidden md:block select-none">swork.com.br/shop/</div>
                <Input name="slug" defaultValue={currentSlug} placeholder="nome-da-loja" className="bg-slate-900 border-white/10 text-white flex-1 font-mono text-sm" />
                <Button type="submit" size="sm" disabled={loading} className="min-w-[80px]">
                    {loading ? "..." : "Salvar"}
                </Button>
            </div>
            {currentSlug && (
                <a href={`/shop/${currentSlug}`} target="_blank" className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1">
                    <ExternalLink className="h-3 w-3" /> Visualizar: /shop/{currentSlug}
                </a>
            )}
            {error && <div className="text-sm text-red-400 font-medium">{error}</div>}
            {success && (
                <div className="text-sm text-green-400 font-medium animate-in fade-in slide-in-from-top-1">
                    URL atualizada com sucesso!
                </div>
            )}
        </form>
    )
}
