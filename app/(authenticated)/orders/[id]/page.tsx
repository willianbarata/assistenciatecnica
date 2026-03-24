import { getOrder } from "./actions"
import OrderDetails from "@/components/OrderDetails"
import { notFound } from "next/navigation"

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const order = await getOrder(parseInt(id))

    if (!order) {
        notFound()
    }

    return (
        <div className="max-w-5xl mx-auto py-6">
            <OrderDetails order={order} />
        </div>
    )
}
