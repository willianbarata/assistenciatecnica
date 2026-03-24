'use client'

import { createOrder, updateOrder } from "@/app/(authenticated)/orders/actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Modal } from "@/components/ui/Modal"
import { Badge } from "@/components/ui/Badge"
import { useState, useEffect } from "react"
import { Trash2, Search, User, Smartphone, Package, Wrench, Plus, X, ChevronRight } from "lucide-react"
import Link from "next/link"

// Types for props
type Props = {
    data: {
        clients: any[]
        products: any[]
        services: any[]
    },
    initialOrder?: any
}

interface OrderItem {
    id: number
    type: string
    name: string
    price: number
    quantity: number
    total: number
}

export default function OrderForm({ data, initialOrder }: Props) {
    const [items, setItems] = useState<OrderItem[]>([])

    // Client Selection
    const [selectedClientId, setSelectedClientId] = useState("")
    const [isClientModalOpen, setIsClientModalOpen] = useState(false)
    const [clientSearch, setClientSearch] = useState("")

    // Item Selection
    const [isItemModalOpen, setIsItemModalOpen] = useState(false)
    const [itemSearch, setItemSearch] = useState("")
    const [itemTab, setItemTab] = useState<'PRODUCT' | 'SERVICE'>('SERVICE')

    // Selected Item for Addition
    const [pendingItem, setPendingItem] = useState<any>(null)
    const [pendingQty, setPendingQty] = useState(1)
    const [pendingPrice, setPendingPrice] = useState(0)

    // Device
    const [clientDevices, setClientDevices] = useState<any[]>([])
    const [selectedDeviceId, setSelectedDeviceId] = useState("")
    const [deviceMode, setDeviceMode] = useState<'REGISTERED' | 'MANUAL'>('MANUAL')
    const [deviceInput, setDeviceInput] = useState(initialOrder?.device || "")
    const [description, setDescription] = useState(initialOrder?.description || "")

    // Filter Logic
    const filteredClients = data.clients.filter(c =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.phone?.includes(clientSearch) ||
        c.email?.toLowerCase().includes(clientSearch.toLowerCase())
    )

    const filteredItems = (itemTab === 'PRODUCT' ? data.products : data.services).filter(i =>
        i.name.toLowerCase().includes(itemSearch.toLowerCase())
    )

    const selectedClientObj = data.clients.find(c => c.id.toString() === selectedClientId)

    // Effects
    useEffect(() => {
        if (selectedClientId) {
            import("@/app/(authenticated)/clients/[id]/actions").then(mod => {
                mod.getClientDevices(parseInt(selectedClientId)).then(devs => {
                    setClientDevices(devs)
                    if (devs.length > 0) {
                        setDeviceMode('REGISTERED')
                        setSelectedDeviceId("")
                    } else {
                        setDeviceMode('MANUAL')
                    }
                })
            })
        } else {
            setClientDevices([])
            setDeviceMode('MANUAL')
        }
    }, [selectedClientId])

    useEffect(() => {
        if (initialOrder) {
            setSelectedClientId(initialOrder.clientId.toString())
            setDescription(initialOrder.description)
            // Restore items
            const formattedItems = initialOrder.items.map((i: any) => ({
                id: i.productId || i.serviceId,
                type: i.productId ? 'PRODUCT' : 'SERVICE',
                name: i.product?.name || i.service?.name || "Item desconhecido",
                price: Number(i.unitPrice),
                quantity: i.quantity,
                total: Number(i.unitPrice) * i.quantity
            }))
            setItems(formattedItems)
        }
    }, [initialOrder])

    // Handlers
    const handleAddPendingItem = () => {
        if (!pendingItem) return
        setItems([...items, {
            id: pendingItem.id,
            type: itemTab,
            name: pendingItem.name,
            price: Number(pendingPrice),
            quantity: Number(pendingQty),
            total: Number(pendingPrice) * Number(pendingQty)
        }])
        setPendingItem(null)
        setPendingQty(1)
        setPendingPrice(0)
        setIsItemModalOpen(false)
    }

    const selectClient = (id: string) => {
        setSelectedClientId(id)
        setIsClientModalOpen(false)
        setClientSearch("")
    }

    const removeItem = (index: number) => {
        const newItems = [...items]
        newItems.splice(index, 1)
        setItems(newItems)
    }

    const totalOrder = items.reduce((acc, curr) => acc + curr.total, 0)
    const updateAction = initialOrder ? updateOrder.bind(null, initialOrder.id) : undefined

    return (
        <form action={initialOrder ? updateAction : createOrder} className="space-y-8">
            <input type="hidden" name="items" value={JSON.stringify(items)} />
            <input type="hidden" name="clientId" value={selectedClientId} />
            <input type="hidden" name="deviceId" value={selectedDeviceId} />

            {/* Logic for device string: 
                If Registered mode & ID selected -> Device string comes from found device model 
                If Manual mode -> Device string comes from input
            */}
            <input type="hidden" name="device" value={
                deviceMode === 'REGISTERED' && selectedDeviceId
                    ? (clientDevices.find(d => d.id.toString() === selectedDeviceId)?.model || deviceInput)
                    : deviceInput
            } />

            <input type="hidden" name="description" value={description} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COL: Client & Equipment */}
                <div className="lg:col-span-1 space-y-6">
                    <section>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" /> Cliente
                        </h3>

                        {!selectedClientObj ? (
                            <div
                                onClick={() => setIsClientModalOpen(true)}
                                className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-zinc-400 hover:text-white hover:border-primary/50 hover:bg-white/5 cursor-pointer transition-all"
                            >
                                <Search className="h-8 w-8 mb-2" />
                                <span className="font-medium">Buscar Cliente</span>
                                <span className="text-xs text-zinc-500 mt-1">Nome, CPF, Email ou Telefone</span>
                            </div>
                        ) : (
                            <Card className="relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button type="button" size="icon" variant="secondary" onClick={() => setIsClientModalOpen(true)}>
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardContent className="p-4 space-y-2">
                                    <div className="font-bold text-lg text-white">{selectedClientObj.name}</div>
                                    <div className="text-sm text-zinc-400">{selectedClientObj.email}</div>
                                    <div className="flex gap-2">
                                        {selectedClientObj.phone && <Badge variant="outline">{selectedClientObj.phone}</Badge>}
                                        {selectedClientObj.cpfOrCnpj && <Badge variant="secondary">{selectedClientObj.cpfOrCnpj}</Badge>}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </section>

                    {selectedClientObj && (
                        <section className="animate-in slide-in-from-left-2 fade-in">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Smartphone className="h-5 w-5 text-primary" /> Aparelho
                            </h3>
                            <Card>
                                <CardContent className="p-4 space-y-4">
                                    {clientDevices.length > 0 && (
                                        <div className="flex bg-slate-900 rounded-lg p-1">
                                            <button
                                                type="button"
                                                onClick={() => setDeviceMode('REGISTERED')}
                                                className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${deviceMode === 'REGISTERED' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                                            >
                                                Registrado
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeviceMode('MANUAL')}
                                                className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${deviceMode === 'MANUAL' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                                            >
                                                Manual
                                            </button>
                                        </div>
                                    )}

                                    {deviceMode === 'REGISTERED' && clientDevices.length > 0 ? (
                                        <select
                                            className="w-full bg-slate-950 border border-white/10 rounded-md p-3 text-white text-base"
                                            value={selectedDeviceId}
                                            onChange={(e) => {
                                                setSelectedDeviceId(e.target.value)
                                            }}
                                        >
                                            <option value="">Selecione um aparelho...</option>
                                            {clientDevices.map(d => (
                                                <option key={d.id} value={d.id}>{d.brand} {d.model}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <Input
                                            name="device_manual_input"
                                            value={deviceInput}
                                            onChange={(e) => setDeviceInput(e.target.value)}
                                            placeholder="Ex: iPhone 13 Pro - Tela Quebrada"
                                            required={deviceMode === 'MANUAL'}
                                            className="h-12 text-lg"
                                        />
                                    )}

                                    <div>
                                        <label className="text-xs font-medium text-zinc-500 mb-1 block">Relato do problema</label>
                                        <textarea
                                            className="w-full h-48 bg-slate-950 border border-white/10 rounded-md p-4 text-white text-base resize-y focus:outline-none focus:border-primary"
                                            placeholder="Descreva o problema detalhadamente..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    )}
                </div>

                {/* RIGHT COL: Items & Summary */}
                <div className="lg:col-span-2 space-y-6">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" /> Itens da Ordem
                            </h3>
                            <Button type="button" onClick={() => setIsItemModalOpen(true)} disabled={!selectedClientObj}>
                                <Plus className="mr-2 h-4 w-4" /> Adicionar Item
                            </Button>
                        </div>

                        <Card className="min-h-[200px] flex flex-col">
                            {items.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 opacity-50 py-12">
                                    <Package className="h-12 w-12 mb-2" />
                                    <p>Nenhum item adicionado</p>
                                </div>
                            ) : (
                                <div className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-white/10 hover:bg-transparent">
                                                <TableHead>Descrição</TableHead>
                                                <TableHead>Qtd</TableHead>
                                                <TableHead>Unitário</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.map((item, idx) => (
                                                <TableRow key={idx} className="border-white/5">
                                                    <TableCell>
                                                        <div className="font-medium text-white">{item.name}</div>
                                                        <Badge variant="secondary" className="text-[10px] h-5">{item.type === 'PRODUCT' ? 'PRODUTO' : 'SERVIÇO'}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="bg-slate-900 rounded w-8 h-8 flex items-center justify-center text-sm">{item.quantity}</div>
                                                    </TableCell>
                                                    <TableCell>R$ {item.price.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right font-bold text-white">R$ {item.total.toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        <button type="button" onClick={() => removeItem(idx)} className="text-zinc-500 hover:text-red-400">
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                            {items.length > 0 && (
                                <div className="p-4 border-t border-white/10 bg-slate-900/50 mt-auto">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Total Estimado</span>
                                        <span className="text-2xl font-bold text-green-400">R$ {totalOrder.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </section>

                    <div className="flex justify-end pt-8">
                        <Link href="/orders">
                            <Button variant="ghost" type="button" className="mr-4">Cancelar</Button>
                        </Link>
                        <Button type="submit" size="lg" className="w-full md:w-auto bg-green-600 hover:bg-green-700" disabled={items.length === 0 || !selectedClientObj}>
                            {initialOrder ? 'Salvar Alterações' : 'Finalizar e Gerar Ordem'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- CLIENT MODAL --- */}
            <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title="Buscar Cliente">
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por Nome, CPF, Email ou Telefone..."
                            className="pl-9 bg-slate-900 border-white/10"
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {filteredClients.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">Nenhum cliente encontrado.</div>
                        ) : (
                            filteredClients.map(client => (
                                <div
                                    key={client.id}
                                    onClick={() => selectClient(client.id.toString())}
                                    className="p-3 rounded-lg border border-white/5 hover:bg-slate-800 hover:border-primary/30 cursor-pointer flex justify-between items-center group transition-all"
                                >
                                    <div>
                                        <div className="font-medium text-white group-hover:text-primary transition-colors">{client.name}</div>
                                        <div className="text-xs text-zinc-400 flex gap-2">
                                            {client.phone && <span>{client.phone}</span>}
                                            {client.cpfOrCnpj && <span>• {client.cpfOrCnpj}</span>}
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-white" />
                                </div>
                            ))
                        )}
                    </div>
                    <div className="pt-2 border-t border-white/10">
                        <Link href="/clients/new">
                            <Button variant="outline" className="w-full text-xs h-8">
                                <Plus className="mr-2 h-3 w-3" /> Cadastrar Novo Cliente
                            </Button>
                        </Link>
                    </div>
                </div>
            </Modal>

            {/* --- ITEM MODAL --- */}
            <Modal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} title="Adicionar Item">
                <div className="space-y-4">
                    {/* View: List vs Detail */}
                    {!pendingItem ? (
                        <>
                            <div className="flex gap-2 p-1 bg-slate-900 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setItemTab('SERVICE')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors ${itemTab === 'SERVICE' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    <Wrench className="h-4 w-4" /> Serviços
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setItemTab('PRODUCT')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors ${itemTab === 'PRODUCT' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                                >
                                    <Package className="h-4 w-4" /> Peças/Produtos
                                </button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={itemTab === 'SERVICE' ? "Buscar serviço..." : "Buscar produto..."}
                                    className="pl-9 bg-slate-900 border-white/10"
                                    value={itemSearch}
                                    onChange={(e) => setItemSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-1 mt-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {filteredItems.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">Nada encontrado.</div>
                                ) : (
                                    filteredItems.map(item => (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                setPendingItem(item)
                                                setPendingPrice(item.price)
                                                setPendingQty(1)
                                            }}
                                            className="p-3 rounded-lg border border-white/5 hover:bg-slate-800 hover:border-primary/30 cursor-pointer flex justify-between items-center group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${itemTab === 'SERVICE' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                    {itemTab === 'SERVICE' ? <Wrench className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{item.name}</div>
                                                    {itemTab === 'PRODUCT' && <div className="text-xs text-zinc-500">Estoque: {item.stock}</div>}
                                                </div>
                                            </div>
                                            <div className="font-bold text-white">R$ {item.price.toFixed(2)}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="animate-in slide-in-from-right-4">
                            <div className="bg-slate-900 rounded-lg p-4 mb-4">
                                <div className="text-sm text-zinc-400 mb-1">{itemTab === 'SERVICE' ? 'Serviço' : 'Produto'} Selecionado</div>
                                <div className="text-xl font-bold text-white mb-4">{pendingItem.name}</div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-400">Preço Unitário (R$)</label>
                                        <Input
                                            type="number"
                                            value={pendingPrice}
                                            onChange={(e) => setPendingPrice(Number(e.target.value))}
                                            className="bg-slate-950 font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-400">Quantidade</label>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => setPendingQty(Math.max(1, pendingQty - 1))} className="h-10 w-10 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center">-</button>
                                            <div className="flex-1 text-center font-bold text-white">{pendingQty}</div>
                                            <button type="button" onClick={() => setPendingQty(pendingQty + 1)} className="h-10 w-10 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center">+</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-end">
                                    <span className="text-sm">Subtotal Item</span>
                                    <span className="text-2xl font-bold text-primary">R$ {(pendingPrice * pendingQty).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" onClick={() => setPendingItem(null)} className="flex-1">Voltar</Button>
                                <Button onClick={handleAddPendingItem} type="button" className="flex-[2] bg-green-600 hover:bg-green-700">Confirmar</Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </form>
    )
}
