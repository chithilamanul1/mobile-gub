import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
    Search,
    Filter,
    Truck,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    User,
    CreditCard
} from "lucide-react"
import Link from "next/link"

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: true,
            items: {
                include: { product: true }
            }
        }
    })

    const pendingCount = orders.filter((o: any) => o.status === "PENDING").length
    const totalProcessing = orders.filter((o: any) => o.status === "PROCESSING").length

    return (
        <div className="space-y-12">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 text-primary">
                        <div className="w-8 h-[2px] bg-primary" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase">TRANSACTIONAL CONTROL</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight uppercase leading-none italic">
                        Order Vault
                    </h1>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                        Process and track institutional mobile hardware allocations.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <OrderStat label="Total Volume" value={orders.length.toString()} />
                <OrderStat label="Pending Process" value={pendingCount.toString()} color="text-primary" icon={<Clock className="w-4 h-4 animate-pulse" />} />
                <OrderStat label="Active Shipments" value={totalProcessing.toString()} icon={<Truck className="w-4 h-4" />} />
            </div>

            {/* Orders Table */}
            <div className="bg-[#080808] border border-white/5 rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="FIND TRANSACTION..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black text-white placeholder:text-white/10 outline-none focus:border-primary/30 transition-all uppercase tracking-widest"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">IDENTIFIER</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">CLIENT</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">VALUE</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">FLOW STATUS</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-right">REGISTRY</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.map((order: any) => (
                                <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-8">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black italic uppercase tracking-tight">#{order.id.slice(-8)}</p>
                                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest">{order.user.name || "Legacy Client"}</p>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <p className="text-sm font-black italic text-primary">₨ {order.total.toLocaleString()}</p>
                                    </td>
                                    <td className="p-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border ${order.status === "COMPLETED" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                            order.status === "PROCESSING" ? "bg-primary/10 text-primary border-primary/20" :
                                                "bg-white/5 text-white/40 border-white/5"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-8 text-right">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Button variant="ghost" className="h-10 w-10 text-white/20 hover:text-primary transition-all p-0">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

function OrderStat({ label, value, color = "text-white", icon = null }: { label: string, value: string, color?: string, icon?: any }) {
    return (
        <div className="p-10 bg-[#080808] border border-white/5 rounded-[40px] space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">{label}</p>
                <div className="text-primary opacity-40">{icon}</div>
            </div>
            <p className={`text-5xl font-black tracking-tighter italic ${color}`}>{value}</p>
        </div>
    )
}
