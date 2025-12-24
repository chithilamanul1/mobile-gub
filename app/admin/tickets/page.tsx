import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    Search,
    User,
    ArrowUpRight,
    Headset
} from "lucide-react"
import Link from "next/link"

export default async function AdminTicketsPage() {

    const tickets = (prisma as any).ticket ? await (prisma as any).ticket.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    }) : []

    const openCount = tickets.filter((t: any) => t.status === "OPEN").length
    const vipCount = tickets.filter((t: any) => t.priority === "VIP" || t.priority === "URGENT").length

    return (
        <div className="space-y-12">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="w-8 h-[2px] bg-primary" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase">COMMUNICATION CONTROL</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight uppercase leading-none italic">
                        Support Command
                    </h1>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                        Manage institutional support streams and VIP client relations.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TicketStat label="Active Requests" value={openCount.toString()} color="text-primary" icon={<Clock className="w-4 h-4 animate-pulse" />} />
                <TicketStat label="VIP Escalations" value={vipCount.toString()} color="text-red-500" icon={<AlertCircle className="w-4 h-4" />} />
                <TicketStat label="Total Registry" value={tickets.length.toString()} icon={<Headset className="w-4 h-4" />} />
            </div>

            {/* Tickets Registry */}
            <div className="bg-[#080808] border border-white/5 rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-white/5">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="SEARCH SUPPORT VAULT..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black text-white placeholder:text-white/10 outline-none focus:border-primary/30 transition-all uppercase tracking-widest"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">SUBJECT / CLIENT</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">PRIORITY</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">TIMESTAMP</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">FLOW STATUS</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {tickets.map((t: any) => (
                                <tr key={t.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-8">
                                        <div className="flex items-center gap-6">
                                            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black uppercase tracking-tight italic">{t.subject}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <User className="w-3 h-3 text-white/20" />
                                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{t.user.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className={`text-[10px] font-black tracking-widest uppercase ${t.priority === 'VIP' ? 'text-red-500' : 'text-primary'
                                            }`}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                            {new Date(t.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </p>
                                    </td>
                                    <td className="p-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border ${t.status === 'OPEN' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-white/5 text-white/20 border-white/5'
                                            }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="p-8 text-right">
                                        <Link href={`/admin/tickets/${t.id}`}>
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

                {tickets.length === 0 && (
                    <div className="p-32 text-center space-y-6">
                        <Headset className="w-16 h-16 mx-auto text-white/5" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">No support requests in registry.</p>
                    </div>
                )}
            </div>

        </div>
    )
}

function TicketStat({ label, value, color = "text-white", icon = null }: { label: string, value: string, color?: string, icon?: any }) {
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
