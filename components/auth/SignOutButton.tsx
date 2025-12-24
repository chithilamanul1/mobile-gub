"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function SignOutButton() {
    return (
        <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex-1 h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:bg-primary px-8 font-black text-[10px] tracking-widest uppercase transition-all"
        >
            <LogOut className="w-4 h-4 mr-2" /> EXIT VAULT
        </Button>
    )
}
