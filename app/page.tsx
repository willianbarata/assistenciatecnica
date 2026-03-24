import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Check, Shield, Zap, Smartphone } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-white/10 glass sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Smartphone className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">TechFix SaaS</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/marketplace">
            <Button variant="ghost" className="text-zinc-300 hover:text-white">Marketplace</Button>
          </Link>
          <Link href="/tracking">
            <Button variant="ghost" className="text-zinc-300 hover:text-white">Rastrear Aparelho</Button>
          </Link>

          <div className="h-6 w-px bg-zinc-800 mx-2"></div>

          <Link href="/login?type=client">
            <Button variant="outline" className="text-emerald-400 border-emerald-400/20 hover:bg-emerald-400/10">
              Entrar (Cliente)
            </Button>
          </Link>
          <Link href="/login?type=seller">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white border-0">
              Entrar (Parceiro)
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[100px] rounded-full -z-10" />
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-in text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Gerencie sua Assistência <br /> como um Profissional
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            O sistema completo para controle de Ordens de Serviço, Estoque e Clientes. Feito para assistências técnicas de celulares e notebooks.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">Criar Conta Grátis</Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 hover:bg-white/5">Saiba Mais</Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-6 bg-slate-900/50">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-emerald-400" />}
              title="Controle Total"
              description="Gerencie clientes, aparelhos e ordens de serviço em um só lugar com histórico completo."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-amber-400" />}
              title="Gestão de Estoque"
              description="Baixa automática de peças ao criar OS. Alertas de estoque baixo e controle de lucro."
            />
            <FeatureCard
              icon={<Check className="w-8 h-8 text-blue-400" />}
              title="Financeiro Simples"
              description="Dashboard intuitivo com receitas, custos e lucro líquido em tempo real."
            />
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-24 px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Planos que cabem no seu bolso</h2>
            <p className="text-gray-400">Comece grátis e evolua conforme sua assistência cresce.</p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 items-start">
            <PricingCard
              title="Iniciante"
              price="R$ 0"
              period="/mês"
              features={[
                "10 Clientes",
                "10 Produtos e 10 Serviços",
                "Total de 50 Ordens de Serviço",
                "5 Anúncios no Marketplace",
                "1 Usuário"
              ]}
              cta="Começar Grátis"
              href="/signup?plan=free"
            />
            <PricingCard
              title="Profissional"
              price="R$ 49"
              period="/mês"
              isPopular
              features={[
                "200 Clientes",
                "50 Produtos e 50 Serviços",
                "1000 Ordens de Serviço/mês",
                "50 Anúncios no Marketplace",
                "Dashboard Financeiro",
                "Suporte Prioritário"
              ]}
              cta="Assinar Pro"
              href="/signup?plan=pro"
            />
            <PricingCard
              title="Enterprise"
              price="R$ 99"
              period="/mês"
              features={[
                "Tudo Ilimitado",
                "Múltiplas Lojas (Filiais)",
                "API de Integração",
                "Domínio Personalizado",
                "Gerente de Conta"
              ]}
              cta="Falar com Vendas"
              href="/signup?plan=enterprise"
            />
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t border-white/10 text-center text-gray-500 text-sm">
        © 2024 TechFix SaaS. Todos os direitos reservados.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors">
      <div className="mb-4 bg-white/10 w-14 h-14 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

function PricingCard({ title, price, period, features, isPopular, cta, href }: any) {
  return (
    <div className={`p-8 rounded-2xl border ${isPopular ? 'border-blue-500 bg-blue-900/10 relative' : 'border-white/10 bg-white/5'} flex flex-col`}>
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Mais Popular
        </span>
      )}
      <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-bold text-white">{price}</span>
        <span className="text-gray-500">{period}</span>
      </div>
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feat: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            {feat}
          </li>
        ))}
      </ul>
      <Link href={href} className="w-full">
        <Button className={`w-full ${isPopular ? 'bg-blue-600 hover:bg-blue-500' : 'bg-white/10 hover:bg-white/20'}`}>
          {cta}
        </Button>
      </Link>
    </div>
  )
}
