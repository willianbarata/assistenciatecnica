"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/app/auth/actions"
import {
    BarChart3,
    Users,
    Package,
    Wrench,
    FileText,
    Settings,
    DollarSign,
    LogOut,
    Store,
    MessageSquare
} from "lucide-react"

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/clients", label: "Clientes", icon: Users },
    { href: "/products", label: "Produtos", icon: Package },
    { href: "/services", label: "Serviços", icon: Wrench },
    { href: "/orders", label: "Ordens de Serviço", icon: FileText },
    { href: "/finance/cash", label: "Fluxo de Caixa", icon: DollarSign }, // New Cash Register
    { href: "/transactions", label: "Relatórios de Vendas", icon: BarChart3 },
    { href: "/messages", label: "Mensagens (Leads)", icon: MessageSquare },
    { href: "/marketplace", label: "Marketplace (Loja)", icon: Store }, // Public Marketplace
    { href: "/admin", label: "Admin SaaS", icon: Settings }, // Temporary placement
]

export function Sidebar({ role }: { role?: string }) {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-64 flex-col border-r border-border bg-surface glass">
            <div className="p-6">
                <h1 className="text-xl font-bold tracking-tight text-primary">
                    TechFix SaaS
                </h1>
            </div>
            <nav className="flex-1 space-y-1 px-3">
                {navItems.filter(item => {
                    if (item.href === '/admin' && role !== 'ADMIN') return false
                    return true
                }).map((item) => {
                    const Icon = item.icon
                    const isActive = pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-highlight hover:text-white",
                                isActive
                                    ? "bg-primary/20 text-primary border-r-2 border-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-slate-400 group-hover:text-white")} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
            <div className="p-4 border-t border-border space-y-2">
                <Link
                    href="/settings"
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-surface-highlight hover:text-white"
                >
                    <Settings className="mr-3 h-5 w-5" />
                    Configurações
                </Link>
                <button
                    onClick={() => logoutAction()}
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sair
                </button>
            </div>
        </div>
    )
}
