import { getUserSettings } from "./actions"
import { PhoneForm } from "./PhoneForm"
import { SlugForm } from "./SlugForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Check, Shield } from "lucide-react"

import { Input } from "@/components/ui/Input"
import { updateSettings } from "./actions"

export const dynamic = 'force-dynamic'

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function SettingsPage() {
    const user = await getUserSettings()

    if (!user) return <div className="text-white">Carregando...</div>

    const plans = [
        { name: "FREE", price: "R$ 0", features: ["Até 100 Clientes", "Gestão Básica", "1 Usuário"] },
        { name: "PRO", price: "R$ 49/mês", features: ["Clientes Ilimitados", "Gestão Financeira", "Dashboard Avançado", "Suporte Prioritário"] },
        { name: "ENTERPRISE", price: "R$ 199/mês", features: ["Tudo do Pro", "API Access", "Multi-usuários", "Whitelabel"] },
    ]

    return (
        <div className="space-y-6 container mx-auto p-6 md:py-12">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight text-white gap-2 flex items-center">
                    <Shield className="h-8 w-8 text-primary" />
                    Configurações da Conta
                </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* User Info */}
                <Card>
                    <CardHeader><CardTitle>Perfil</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Nome</label>
                            <div className="text-lg font-bold text-white">{user.name}</div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <div className="text-lg text-white">{user.email}</div>
                        </div>
                        <PhoneForm initialPhone={user.phone || ''} />
                        <SlugForm initialSlug={user.slug || ''} />
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Plano Atual</label>
                            <div className="text-lg font-bold text-green-400">{user.plan}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription Status */}
                <Card>
                    <CardHeader><CardTitle>Status da Assinatura</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-muted-foreground">Você está utilizando o plano <strong className="text-white">{user.plan}</strong>.</p>
                        <p className="text-sm text-slate-400">Próxima renovação em: 25/02/2026 (Simulado)</p>
                        <Button className="w-full mt-4 bg-primary hover:bg-primary/80">Gerenciar Assinatura</Button>
                    </CardContent>
                </Card>
            </div>

            <h3 className="text-2xl font-bold text-white mt-8">Planos Disponíveis</h3>
            <div className="grid gap-6 md:grid-cols-3">
                {plans.map(plan => (
                    <Card key={plan.name} className={`border-2 ${user.plan === plan.name ? 'border-green-500 bg-green-500/10' : 'border-transparent'}`}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {plan.name}
                                {user.plan === plan.name && <Check className="h-5 w-5 text-green-500" />}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-3xl font-bold text-white">{plan.price}</div>
                            <ul className="space-y-2">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-center text-sm text-muted-foreground">
                                        <Check className="mr-2 h-4 w-4 text-primary" /> {f}
                                    </li>
                                ))}
                            </ul>
                            {user.plan !== plan.name && (
                                <Button className="w-full mt-4" variant="outline">Fazer Upgrade</Button>
                            )}
                            {user.plan === plan.name && (
                                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" disabled>Plano Atual</Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
