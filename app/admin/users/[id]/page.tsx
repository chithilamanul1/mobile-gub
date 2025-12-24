import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import {
    User,
    Shield,
    Mail,
    Calendar,
    ArrowLeft,
    Smartphone,
    ShoppingCart,
    Lock,
    Unlock,
    History
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default async function AdminUserDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            orders: {
                orderBy: { createdAt: 'desc' },
                take: 5
            },
            tickets: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    })

    if (!user) {
        notFound()
    }

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/admin/users" className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Directory</span>
                </Link>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-12 rounded-xl border-white/5 text-[10px] font-black uppercase tracking-widest px-8">SUSPEND ACCESS</Button>
                    <Button className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest px-8 ${user.role === 'OWNER' ? 'bg-primary text-black' : 'bg-white/5 text-white/40'
                        }`}>
                        ELEVATE TO ADMIN
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    {/* Personnel Identity */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 rounded-[32px] bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center">
                                {user.image ? (
                                    <img src={user.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-white/10" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-primary">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-[10px] font-black tracking-[0.4em] uppercase">Security Clearance: {user.role}</span>
                                </div>
                                <h1 className="text-5xl font-black tracking-tight uppercase italic leading-none">{user.name || "Anonymous Personnel"}</h1>
                                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">{user.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Interaction Timeline */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 text-white/20">
                            <History className="w-4 h-4" />
                            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase">RECENT INSTITUTIONAL HISTORY</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-primary ml-1">ALLOCATIONS (LAST 5)</h4>
                                <div className="space-y-3">
                                    {user.orders.map((order: any) => (
                                        <div key={order.id} className="p-6 bg-[#080808] border border-white/5 rounded-3xl flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-tighter italic">Order #{order.id.slice(-6)}</p>
                                                <p className="text-[8px] font-bold text-white/20 uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <p className="text-[10px] font-black text-primary">Rs. {order.total.toLocaleString()}</p>
                                        </div>
                                    ))}
                                    {user.orders.length === 0 && <p className="text-[9px] font-bold text-white/10 uppercase p-6">No recent allocations.</p>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-primary ml-1">SUPPORT LOGS (LAST 5)</h4>
                                <div className="space-y-3">
                                    {user.tickets.map((ticket: any) => (
                                        <div key={ticket.id} className="p-6 bg-[#080808] border border-white/5 rounded-3xl flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-tighter italic truncate max-w-[120px]">{ticket.subject}</p>
                                                <p className="text-[8px] font-bold text-white/20 uppercase">{ticket.status}</p>
                                            </div>
                                            <Link href={`/admin/tickets/${ticket.id}`}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-primary/40 hover:text-primary transition-all">
                                                    <Smartphone className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                    {user.tickets.length === 0 && <p className="text-[9px] font-bold text-white/10 uppercase p-6">No active support logs.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Personnel Context */}
                    <Card className="bg-[#080808] border-white/5 rounded-[40px] p-8 space-y-8">
                        <div>
                            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary mb-6">COMMUNICATION</h3>
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <Mail className="w-4 h-4 text-white/20" />
                                <p className="text-[10px] font-bold text-white lowercase tracking-tight">{user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">REGISTRY DATE</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-white/20" />
                                    <span className="text-[9px] font-bold text-white uppercase">{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">ACCESS LEVEL</span>
                                <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{user.role}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Operational Protocols */}
                    <Card className="bg-primary/5 border border-primary/20 rounded-[40px] p-8 space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <Lock className="w-4 h-4" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Registry Protocols</h4>
                        </div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                            Access logs and institutional allocations are permanently bound to the personnel identifier for security audit trails.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}
