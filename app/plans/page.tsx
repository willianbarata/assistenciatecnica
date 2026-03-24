import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PlansPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-16">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        Escolha o plano ideal para sua assistência
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        Comece gratuitamente e evolua conforme sua empresa cresce.
                        Sem fidelidade, cancele quando quiser.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Plano Gratuito */}
                    <Card className="border-white/10 bg-slate-900/50 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">Iniciante</CardTitle>
                            <CardDescription className="text-zinc-400">Para quem está começando</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-white">R$ 0</span>
                                <span className="text-zinc-500 ml-2">/mês</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3">
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    Total de 50 Ordens de Serviço
                                </li>
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    10 Clientes
                                </li>
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    10 Produtos e 10 Serviços
                                </li>
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    5 Anúncios no Marketplace
                                </li>
                                <li className="flex items-center text-zinc-500">
                                    <Check className="h-4 w-4 text-zinc-700 mr-2" />
                                    Sem integração WhatsApp
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Link href="/signup" className="w-full">
                                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white">
                                    Começar Grátis
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Plano Profissional */}
                    <Card className="border-blue-500/50 bg-slate-900 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                            MAIS POPULAR
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl text-blue-400">Profissional</CardTitle>
                            <CardDescription className="text-zinc-400">Tudo para sua loja crescer</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-white">R$ 49,90</span>
                                <span className="text-zinc-500 ml-2">/mês</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3">
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    1000 Ordens de Serviço/mês
                                </li>
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    200 Clientes
                                </li>
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    50 Produtos e 50 Serviços
                                </li>
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    50 Anúncios no Marketplace
                                </li>
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    Integração com WhatsApp
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Link href="/signup?plan=pro" className="w-full">
                                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                                    Assinar Agora
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Plano Enterprise */}
                    <Card className="border-white/10 bg-slate-900/50 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">Enterprise</CardTitle>
                            <CardDescription className="text-zinc-400">Para grandes redes</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-white">R$ 99,90</span>
                                <span className="text-zinc-500 ml-2">/mês</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3">
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    Tudo Ilimitado
                                </li>
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    Múltiplas Lojas (Filiais)
                                </li>
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    Usuários Ilimitados
                                </li>
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    API de Integração
                                </li>
                                <li className="flex items-center text-zinc-300">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    Suporte Prioritário 24/7
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Link href="/contact" className="w-full">
                                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white">
                                    Falar com Vendas
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>

                <div className="mt-20 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white text-center mb-8">Perguntas Frequentes</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-white">Posso mudar de plano?</h3>
                            <p className="text-zinc-400 text-sm">Sim, você pode fazer upgrade ou downgrade a qualquer momento através do seu painel.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-white">Tem fidelidade?</h3>
                            <p className="text-zinc-400 text-sm">Não, nossos planos são mensais e você pode cancelar quando quiser sem multa.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-white">Como funciona o suporte?</h3>
                            <p className="text-zinc-400 text-sm">O suporte é feito via chat e e-mail em horário comercial para todos os planos.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-white">Preciso instalar algo?</h3>
                            <p className="text-zinc-400 text-sm">Não! O sistema é 100% online e funciona em qualquer navegador, celular ou tablet.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
