"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft,
    Mail,
    Calendar,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    MessageSquare,
    Package
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function CustomerDetailPage() {
    const params = useParams()
    const customerId = params.id as string
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        fetchCustomerData()
    }, [customerId])

    const fetchCustomerData = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/admin/customers/${customerId}`)
            if (!res.ok) throw new Error("Failed to load")
            const customerData = await res.json()
            setData(customerData)
        } catch (error) {
            toast.error("Customer data unavailable.")
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 animate-pulse">Loading Profile...</span>
        </div>
    )

    if (!data) return (
        <div className="h-96 flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Customer Not Found</span>
        </div>
    )

    const { customer, metrics, orders, recentTickets, activities } = data

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-12">
                <div className="flex items-center gap-6">
                    <Link href="/admin/customers" className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Registry</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        {customer.image ? (
                            <img src={customer.image} alt="" className="w-16 h-16 rounded-2xl" />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-2xl font-black">
                                {customer.name?.[0] || "?"}
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-black tracking-tight uppercase leading-none italic">{customer.name}</h1>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-2">{customer.email}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-white/10 hover:border-primary/40 transition-all">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Contact</span>
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard label="Total Orders" value={metrics.totalOrders.toString()} icon={<ShoppingBag />} />
                <MetricCard label="Lifetime Value" value={`₨ ${metrics.totalSpent.toLocaleString()}`} icon={<DollarSign />} color="text-primary" />
                <MetricCard label="Avg Order Value" value={`₨ ${metrics.avgOrderValue.toLocaleString()}`} icon={<TrendingUp />} />
                <MetricCard label="Support Tickets" value={metrics.totalTickets.toString()} icon={<MessageSquare />} color="text-white/60" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Order History */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="bg-[#080808] border-white/5 rounded-[40px] p-10 space-y-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">ORDER HISTORY</h3>
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">{orders.length} Total</span>
                        </div>
                        <div className="space-y-4">
                            {orders.map((order: any) => (
                                <div key={order.id} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[11px] font-black uppercase text-white">Order #{order.id.slice(0, 8)}</p>
                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">
                                                {new Date(order.createdAt).toLocaleDateString()} • {order.itemCount} items
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[12px] font-black text-primary">₨ {order.total.toLocaleString()}</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mt-2 ${order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' :
                                                    order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' :
                                                        'bg-blue-500/20 text-blue-500'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="border-t border-white/5 pt-3 space-y-2">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                                                <Package className="w-3 h-3" />
                                                {item.product}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Activity Timeline */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="bg-[#080808] border-white/5 rounded-[40px] p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">ACTIVITY STREAM</h3>
                        </div>
                        <div className="space-y-4">
                            {activities.map((activity: any, idx: number) => (
                                <div key={idx} className="flex gap-4">
                                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.type === 'order' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40'
                                        }`}>
                                        {activity.type === 'order' ? <ShoppingBag className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase text-white">{activity.description}</p>
                                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">
                                            {new Date(activity.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Recent Tickets */}
                    {recentTickets.length > 0 && (
                        <Card className="bg-[#080808] border-white/5 rounded-[40px] p-8 space-y-6">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                                <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">SUPPORT TICKETS</h3>
                            </div>
                            <div className="space-y-3">
                                {recentTickets.map((ticket: any) => (
                                    <Link key={ticket.id} href={`/admin/tickets/${ticket.id}`}>
                                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                                            <p className="text-[10px] font-black uppercase text-white">{ticket.subject}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`px-2 py-1 rounded-full text-[7px] font-black uppercase ${ticket.status === 'OPEN' ? 'bg-red-500/20 text-red-500' :
                                                        ticket.status === 'RESOLVED' ? 'bg-green-500/20 text-green-500' :
                                                            'bg-blue-500/20 text-blue-500'
                                                    }`}>
                                                    {ticket.status}
                                                </span>
                                                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

function MetricCard({ label, value, icon, color = "text-white" }: any) {
    return (
        <Card className="bg-[#080808] border-white/5 rounded-[32px] overflow-hidden">
            <CardContent className="p-6 space-y-3">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">{label}</p>
                    <p className={`text-2xl font-black tracking-tighter italic ${color}`}>{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}
