'use client'

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { updateSettings } from "./actions"
import { useState } from "react"

export function PhoneForm({ initialPhone }: { initialPhone: string }) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setSuccess(false)
        try {
            await updateSettings(formData)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">WhatsApp (Contato de Vendas)</label>
            <div className="flex gap-2">
                <Input name="phone" defaultValue={initialPhone} placeholder="11999999999" className="bg-slate-900 border-white/10 text-white" />
                <Button type="submit" size="sm" disabled={loading} className="min-w-[80px]">
                    {loading ? "..." : "Salvar"}
                </Button>
            </div>
            {success && (
                <div className="text-sm text-green-400 font-medium animate-in fade-in slide-in-from-top-1">
                    Whatsapp alterado com sucesso !
                </div>
            )}
        </form>
    )
}
