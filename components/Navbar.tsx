import Link from "next/link"
import { Wrench } from "lucide-react"
import { Button } from "./ui/Button"

export function Navbar() {
    return (
        <header className="w-full border-b border-white/10 bg-slate-950 p-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                        <Wrench className="h-5 w-5 text-white" />
                    </div>
                    <span>AssisTec</span>
                </Link>

                <nav className="flex items-center gap-6">
                    <Link href="/marketplace" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                        Marketplace
                    </Link>
                    <Link href="/plans" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                        Planos
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="outline" size="sm" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                            Dashboard
                        </Button>
                    </Link>
                </nav>
            </div>
        </header>
    )
}
