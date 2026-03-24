'use client'
import { logoutAction } from "./actions"
import { Button } from "@/components/ui/Button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
    return (
        <Button variant="ghost" size="sm" onClick={() => logoutAction()} className="text-zinc-400 hover:text-white">
            <LogOut className="h-4 w-4 mr-2" /> Sair
        </Button>
    )
}
