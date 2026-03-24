import { getClientsAndItems } from "../actions"
import OrderForm from "@/components/OrderForm"
import { Button } from "@/components/ui/Button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewOrderPage() {
    const data = await getClientsAndItems()

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/orders">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-white">Nova Ordem de Serviço</h2>
            </div>

            <OrderForm data={data} />
        </div>
    )
}
