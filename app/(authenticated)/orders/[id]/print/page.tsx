import { getOrder } from "../actions"
import { redirect } from "next/navigation"
import { Printer } from "lucide-react"

export default async function PrintOrderPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const id = parseInt(params.id)
    if (isNaN(id)) redirect('/orders')

    const order = await getOrder(id)
    if (!order) redirect('/orders')

    return (
        <div className="bg-white text-black min-h-screen p-8 print:p-0">
            {/* Print Trigger - Hidden in Print Mode */}
            <div className="print:hidden mb-6 flex justify-end">
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 transition"
                >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir Ordem
                </button>
            </div>

            {/* Printable Content */}
            <div className="max-w-3xl mx-auto border p-8 print:border-0 print:p-0">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Assistencia Técnica</h1>
                        <p className="text-sm text-gray-500">TechFix SaaS</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold">Ordem de Serviço #{order.id}</h2>
                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Client Info */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Cliente</h3>
                        <div className="text-gray-900 font-medium">{order.client.name}</div>
                        <div className="text-gray-600">{order.client.email}</div>
                        <div className="text-gray-600">{order.client.phone}</div>
                        <div className="text-gray-600">{order.client.address}</div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Aparelho</h3>
                        <div className="text-gray-900 font-medium">{order.device}</div>
                        <div className="text-gray-600 mt-2 bg-gray-100 p-2 rounded text-sm">
                            <strong>Problema:</strong> {order.description}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Serviços e Peças</h3>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="py-2 text-sm font-semibold text-gray-700">Item</th>
                                <th className="py-2 text-sm font-semibold text-gray-700 text-right w-24">Qtd</th>
                                <th className="py-2 text-sm font-semibold text-gray-700 text-right w-32">Unitário</th>
                                <th className="py-2 text-sm font-semibold text-gray-700 text-right w-32">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item: any) => (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="py-2">
                                        <div className="font-medium">{item.product?.name || item.service?.name || "Item desconhecido"}</div>
                                        <div className="text-xs text-gray-500">{item.productId ? 'Peça' : 'Serviço'}</div>
                                    </td>
                                    <td className="py-2 text-right">{item.quantity}</td>
                                    <td className="py-2 text-right">R$ {item.unitPrice.toFixed(2)}</td>
                                    <td className="py-2 text-right font-medium">R$ {item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3} className="pt-4 text-right font-bold text-gray-800 text-lg">TOTAL</td>
                                <td className="pt-4 text-right font-bold text-gray-800 text-lg">R$ {order.total.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer / Terms */}
                <div className="border-t pt-8 text-xs text-gray-500">
                    <p className="mb-2"><strong>Termos e Condições:</strong></p>
                    <p>1. A garantia dos serviços é de 90 dias.</p>
                    <p>2. Aparelhos não retirados em até 30 dias após a conclusão estarão sujeitos a taxa de armazenamento.</p>
                    <br />
                    <div className="flex justify-between mt-8">
                        <div className="border-t w-64 pt-2 text-center">Assinatura do Cliente</div>
                        <div className="border-t w-64 pt-2 text-center">Assinatura da Loja</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
