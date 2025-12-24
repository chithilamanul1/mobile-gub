"use client"

import Link from "next/link"
import { Home, Grid, MessageCircle, ShieldCheck } from "lucide-react"
import { usePathname } from "next/navigation"

export function BottomNav() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
            <nav className="glass-dark rounded-full flex justify-around items-center h-16 px-6 border border-white/10 shadow-2xl backdrop-blur-xl bg-black/80">
                <Link href="/" className={`flex flex-col items-center justify-center transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
                    <Home size={20} />
                    {isActive('/') && <span className="h-1 w-1 rounded-full bg-primary mt-1"></span>}
                </Link>
                <Link href="/categories" className={`flex flex-col items-center justify-center transition-colors ${isActive('/categories') ? 'text-primary' : 'text-muted-foreground'}`}>
                    <Grid size={20} />
                    {isActive('/categories') && <span className="h-1 w-1 rounded-full bg-primary mt-1"></span>}
                </Link>
                <Link href="https://wa.me/94768825485" target="_blank" className="flex flex-col items-center justify-center text-muted-foreground hover:text-green-500 transition-colors">
                    <MessageCircle size={20} />
                </Link>
                <Link href="/warranty" className={`flex flex-col items-center justify-center transition-colors ${isActive('/warranty') ? 'text-primary' : 'text-muted-foreground'}`}>
                    <ShieldCheck size={20} />
                    {isActive('/warranty') && <span className="h-1 w-1 rounded-full bg-primary mt-1"></span>}
                </Link>
            </nav>
        </div>
    )
}
