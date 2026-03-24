'use client'

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Filter, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function DateFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initial state from URL
    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '')
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '')

    const handleFilter = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (startDate) params.set('startDate', startDate)
        else params.delete('startDate')

        if (endDate) params.set('endDate', endDate)
        else params.delete('endDate')

        router.push(`?${params.toString()}`)
    }

    const clearFilter = () => {
        setStartDate('')
        setEndDate('')
        router.push('?')
    }

    const hasFilter = startDate || endDate

    return (
        <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800">
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Início</label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-8 text-xs bg-slate-950 border-slate-700"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Fim</label>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-8 text-xs bg-slate-950 border-slate-700"
                    />
                </div>
            </div>

            <div className="flex gap-1 w-full sm:w-auto">
                <Button onClick={handleFilter} size="sm" variant="secondary" className="h-8 w-full sm:w-auto">
                    <Filter className="mr-2 h-3 w-3" /> Filtrar
                </Button>
                {hasFilter && (
                    <Button onClick={clearFilter} size="sm" variant="ghost" className="h-8 px-2 text-slate-400 hover:text-white">
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>
        </div>
    )
}
