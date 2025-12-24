"use client"

import { useState, useEffect } from "react"
import {
    Users,
    TrendingUp,
    Search,
    ArrowUpRight,
    Mail,
    Calendar,
    ShoppingBag,
    DollarSign
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Customer {
    id: string
    name: string
    email: string
    image: string | null
    role: string
    createdAt: string
    orderCount: number
    ticketCount: number
    totalSpent: number
    lastOrderDate: string | null
    lastOrderStatus: string | null
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [summary, setSummary] = useState({
        totalCustomers: 0,
        activeCustomers: 0,
        totalRevenue: 0,
        avgRevenuePerCustomer: 0
    })

    useEffect(() => {
        fetchCustomers()
    }, [search])

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/admin/customers?search=${search}`)
            const data = await res.json()
            setCustomers(data.customers)
            setSummary(data.summary)
        } catch (error) {
            toast.error("Failed to load customer registry.")
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 animate-pulse">Syncing Customer Registry...</span>
        </div>
    )

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="w-8 h-[2px] bg-primary" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase">CLIENT REGISTRY</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight uppercase leading-none italic">
                        Customer Intelligence
                    </h1>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                        Institutional-grade customer relationship management.
                    </p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input
                        placeholder="SEARCH CLIENTS..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-16 bg-[#080808] border-white/10 rounded-2xl pl-14 text-[10px] font-black uppercase tracking-[0.3em] placeholder:text-white/10"
                    />
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    label="Total Clients"
                    value={summary.totalCustomers.toString()}
                    icon={<Users />}
                />
                <KPICard
                    label="Active Clients"
                    value={summary.activeCustomers.toString()}
                    icon={<ShoppingBag />}
                    color="text-primary"
                />
                <KPICard
                    label="Total Revenue"
                    value={`₨ ${summary.totalRevenue.toLocaleString()}`}
                    icon={<DollarSign />}
                    color="text-green-500"
                />
                <KPICard
                    label="Avg Client Value"
                    value={`₨ ${summary.avgRevenuePerCustomer.toLocaleString()}`}
                    icon={<TrendingUp />}
                />
            </div>

            {/* Customers Table */}
            <Card className="bg-[#080808] border-white/5 rounded-[40px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-6 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Client</th>
                                <th className="text-left p-6 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Registered</th>
                                <th className="text-center p-6 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Orders</th>
                                <th className="text-center p-6 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Tickets</th>
                                <th className="text-right p-6 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Lifetime Value</th>
                                <th className="text-center p-6 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            {customer.image ? (
                                                <img src={customer.image} alt="" className="w-10 h-10 rounded-xl" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary text-sm font-black">
                                                    {customer.name?.[0] || "?"}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-[11px] font-black uppercase text-white">{customer.name}</p>
                                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-white/40">
                                            <Calendar className="w-3 h-3" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="text-[11px] font-black text-white">{customer.orderCount}</span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="text-[11px] font-black text-white/60">{customer.ticketCount}</span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className="text-[12px] font-black text-primary">₨ {customer.totalSpent.toLocaleString()}</span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link href={`/admin/customers/${customer.id}`}>
                                                <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

function KPICard({ label, value, icon, color = "text-white" }: any) {
    return (
        <Card className="bg-[#080808] border-white/5 rounded-[32px] overflow-hidden group hover:border-primary/20 transition-all">
            <CardContent className="p-8 space-y-4">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">{label}</p>
                    <p className={`text-3xl font-black tracking-tighter italic ${color}`}>{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}
