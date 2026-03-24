import { getOrder } from "../actions"
import { getClientsAndItems } from "../../actions"
import OrderForm from "@/components/OrderForm"
import { redirect } from "next/navigation"

export default async function EditOrderPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const id = parseInt(params.id)
    if (isNaN(id)) redirect('/orders')

    const order = await getOrder(id)
    if (!order) redirect('/orders')

    // Only allow editing if not COMPLETED ? 
    // User requested editing "existing orders". Typically you can edit open orders. 
    // If completed, maybe warn? For now assume it's allowed but let's stick to standard flow.
    // If I want to restrict: if (order.status === 'COMPLETED') redirect(`/orders/${id}`)

    const formData = await getClientsAndItems()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Editar Ordem #{id}
            </h1>
            <OrderForm data={formData} initialOrder={order} />
        </div>
    )
}
