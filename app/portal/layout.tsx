import Link from "next/link"
import { LogoutButton } from "./LogoutButton"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-black text-white">
            <header className="border-b border-zinc-800 bg-zinc-900/50 p-4 sticky top-0 backdrop-blur-md z-10">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link href="/portal" className="font-bold text-xl text-emerald-400 flex items-center gap-2">
                        Minha Área
                        <span className="text-xs text-zinc-500 font-normal border border-zinc-700 px-2 py-0.5 rounded-full">Cliente</span>
                    </Link>
                    <div className="flex gap-4 items-center">
                        <Link href="/marketplace" className="text-sm text-zinc-400 hover:text-white">Ir para Loja</Link>
                        <LogoutButton />
                    </div>
                </div>
            </header>
            <main className="max-w-4xl mx-auto p-4 py-8">{children}</main>
        </div>
    )
}
