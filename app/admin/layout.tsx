import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    MessageSquare,
    Settings,
    Bell
} from "lucide-react"
import { SignOutButton } from "@/components/auth/SignOutButton"
import { AdminSidebar } from "./AdminSidebar"
import { NotificationBell } from "@/components/admin/NotificationBell"

export default async function AdminLayout({
    children
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    // Strict Institutional Security
    if (!session?.user || (session.user as any).role === "USER") {
        redirect("/")
    }

    return (
        <div className="bg-[#050505] min-h-screen text-white flex">
            {/* Elite Sidebar (Client) */}
            <AdminSidebar user={session.user} />

            {/* Main view shift for fixed sidebar */}
            <main className="flex-1 pl-80 min-h-screen flex flex-col">
                {/* Topbar */}
                <header className="h-20 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-40">
                    <div className="flex items-center gap-6">
                        <h2 className="text-xs font-black tracking-[0.3em] uppercase text-white/40">System Status</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-green-500/80">Operational</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className="h-8 w-[1px] bg-white/5" />
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Sri Lanka Standard Time</p>
                            <p className="text-[10px] font-bold text-white/20 tabular-nums">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="p-10 flex-1">
                    {children}
                </div>
            </main>
        </div>
    )
}
