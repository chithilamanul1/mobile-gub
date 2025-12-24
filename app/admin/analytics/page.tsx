"use client"

import { useState, useEffect } from "react"
import {
    TrendingUp,
    CreditCard,
    Package,
    ShoppingCart,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Filter
} from "lucide-react"
import Link from "next/link"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface AnalyticsData {
    period: number
    salesOverTime: Array<{ date: string; revenue: number; count: number }>
    revenueByProduct: Array<{ product: string; revenue: number; count: number }>
    bestSellers: Array<{ product: string; revenue: number; count: number }>
    lowStockProducts: Array<{
        id: string
        brand: string
        model_name: string
        stock_count: number
        price_lkr: number
    }>
    summary: {
        totalRevenue: number
        totalSales: number
        avgOrderValue: number
        totalProducts: number
        totalIMEIs: number
        availableIMEIs: number
        forecast: number
    }
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('30')

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/admin/analytics?period=${period}`)
                const analytics = await res.json()
                setData(analytics)
            } catch (error) {
                toast.error("Analytics stream interrupted.")
            } finally {
                setLoading(false)
            }
        }
        fetchAnalytics()
    }, [period])

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 animate-pulse">Syncing Business Intelligence...</span>
        </div>
    )

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="w-8 h-[2px] bg-primary" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase">MARKET INTELLIGENCE</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight uppercase leading-none italic">
                        Business Stream
                    </h1>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                        Visualizing institutional growth and transactional velocity.
                    </p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative group">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="h-16 bg-[#080808] border border-white/10 rounded-2xl px-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/60 focus:text-white transition-all outline-none appearance-none cursor-pointer pr-16"
                        >
                            <option value="7">LAST 7 DAYS</option>
                            <option value="30">LAST 30 DAYS</option>
                            <option value="90">LAST 90 DAYS</option>
                            <option value="365">ANNUAL OVERVIEW</option>
                        </select>
                        <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    label="Total Revenue"
                    value={`₨ ${(data?.summary.totalRevenue || 0).toLocaleString()}`}
                    icon={<CreditCard />}
                    trend="+12%"
                    trendUp={true}
                />
                <KPICard
                    label="Total Sales"
                    value={data?.summary.totalSales.toString() || "0"}
                    icon={<ShoppingCart />}
                />
                <KPICard
                    label="Avg Allocation"
                    value={`₨ ${(data?.summary.avgOrderValue || 0).toLocaleString()}`}
                    icon={<TrendingUp />}
                />
                <KPICard
                    label="30-Day Forecast"
                    value={`₨ ${(data?.summary.forecast || 0).toLocaleString()}`}
                    icon={<TrendingUp />}
                    trend="+Projection"
                    trendUp={true}
                    color="text-green-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Trends */}
                <div className="lg:col-span-8 space-y-12">
                    <Card className="bg-[#080808] border-white/5 rounded-[40px] p-10 space-y-8 overflow-hidden relative">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">ALLOCATION VELOCITY</h3>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data?.salesOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                                    <XAxis dataKey="date" stroke="#ffffff20" tick={{ fontSize: 10, fontWeight: 900 }} />
                                    <YAxis stroke="#ffffff20" tick={{ fontSize: 10, fontWeight: 900 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '16px', padding: '16px' }}
                                        itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={4} dot={false} animationDuration={2000} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="bg-[#080808] border-white/5 rounded-[40px] p-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">ASSET PERFORMANCE</h3>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.revenueByProduct}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                                    <XAxis dataKey="product" stroke="#ffffff20" tick={{ fontSize: 8, fontWeight: 900 }} angle={-45} textAnchor="end" height={80} />
                                    <YAxis stroke="#ffffff20" tick={{ fontSize: 10, fontWeight: 900 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '16px' }}
                                    />
                                    <Bar dataKey="revenue" fill="#d4af37" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Best Sellers Table */}
                    <Card className="bg-[#080808] border-white/5 rounded-[40px] p-10 space-y-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">ELITE PERFORMERS</h3>
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Top 10 Assets</span>
                        </div>
                        <div className="space-y-3">
                            {data?.bestSellers.map((item, index) => (
                                <div key={index} className="flex items-center gap-6 p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm ${index < 3 ? 'bg-primary text-black' : 'bg-white/5 text-white/40'}`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="text-[11px] font-black uppercase text-white">{item.product}</h5>
                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{item.count} Units Sold</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[12px] font-black text-primary">₨ {item.revenue.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Alerts */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                        <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">HUB NOTIFICATIONS</h3>
                    </div>

                    <div className="space-y-4">
                        {data?.lowStockProducts.map(product => (
                            <div key={product.id} className="p-6 bg-[#080808] border border-white/5 rounded-3xl space-y-3 group hover:border-red-500/20 transition-all">
                                <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-black text-red-500 tracking-[0.4em] uppercase italic">Inventory Alert</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                </div>
                                <h5 className="text-[10px] font-black uppercase text-white/80">{product.brand} {product.model_name}</h5>
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">
                                    Critical stock level: {product.stock_count} units remaining in registry.
                                </p>
                                <Link href={`/admin/products/${product.id}`}>
                                    <Button variant="ghost" className="w-full mt-2 h-10 text-[8px] font-black uppercase tracking-[0.3em] border border-white/5 rounded-xl hover:bg-white/5 transition-all">
                                        RESTOCK ASSET
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function KPICard({ label, value, icon, trend, trendUp, color = "text-white" }: any) {
    return (
        <Card className="bg-[#080808] border-white/5 rounded-[32px] overflow-hidden group hover:border-primary/20 transition-all">
            <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        {icon}
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${trendUp ? "text-green-500" : "text-red-500"}`}>
                            {trend}
                            {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">{label}</p>
                    <p className={`text-3xl font-black tracking-tighter italic ${color}`}>{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}
