"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    MessageSquare,
    Settings
} from "lucide-react"
import { SignOutButton } from "@/components/auth/SignOutButton"

export function AdminSidebar({ user }: { user: any }) {
    const pathname = usePathname()

    return (
        <aside className="w-80 border-r border-white/5 bg-[#080808] flex flex-col fixed inset-y-0 z-50">
            <div className="p-8 pb-12">
                <Link href="/admin">
                    <img src="/logo.png" alt="Mobile Hub Admin" className="h-8 w-auto grayscale brightness-200" />
                    <p className="text-[10px] font-black tracking-[0.4em] text-primary mt-4 uppercase">Command Center</p>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 font-sans">
                <AdminNavLink href="/admin" icon={<LayoutDashboard />} label="Dashboard" active={pathname === "/admin"} />
                <AdminNavLink href="/admin/orders" icon={<ShoppingCart />} label="Orders" active={pathname.startsWith("/admin/orders")} />
                <AdminNavLink href="/admin/products" icon={<Package />} label="Inventory" active={pathname.startsWith("/admin/products")} />
                <AdminNavLink href="/admin/users" icon={<Users />} label="Users" active={pathname.startsWith("/admin/users")} />
                <AdminNavLink href="/admin/customers" icon={<Users />} label="Customers" active={pathname.startsWith("/admin/customers")} />
                <AdminNavLink href="/admin/tickets" icon={<MessageSquare />} label="Tickets" active={pathname.startsWith("/admin/tickets")} />
                <AdminNavLink href="/admin/settings" icon={<Settings />} label="Settings" active={pathname.startsWith("/admin/settings")} />
            </nav>

            <div className="p-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-4 px-4 py-2">
                    {user.image ? (
                        <img src={user.image} alt="" className="h-8 w-8 rounded-lg" />
                    ) : (
                        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                            {user.name?.[0] || "A"}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase truncate">{user.name}</p>
                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Master Admin</p>
                    </div>
                </div>
                <SignOutButton />
            </div>
        </aside>
    )
}

function AdminNavLink({ href, icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
    return (
        <Link href={href} className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all border border-transparent group ${active
            ? "bg-primary text-black font-black"
            : "text-white/40 hover:bg-white/5 hover:text-white"
            }`}>
            <span className={`text-xl transition-transform group-hover:scale-110 ${active ? "text-black" : "text-primary"}`}>{icon}</span>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">{label}</span>
        </Link>
    )
}
