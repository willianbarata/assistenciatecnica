'use client'

import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Edit, Smartphone, Trash2 } from "lucide-react"

type Props = {
    devices: any[]
    clientId: number
}

export default function DeviceList({ devices }: Props) {
    if (devices.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-slate-800 rounded-lg">
                <Smartphone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum aparelho cadastrado.</p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Aparelho</TableHead>
                    <TableHead>IMEI</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {devices.map((device) => (
                    <TableRow key={device.id}>
                        <TableCell>
                            <div className="font-medium text-white">{device.brand} {device.model}</div>
                            <div className="text-xs text-muted-foreground">{device.color}</div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{device.imei || '-'}</TableCell>
                        <TableCell className="text-xs">{device.condition || 'Bom'}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-400">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
