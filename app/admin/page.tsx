import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import {
    TrendingUp,
    ShoppingCart,
    Package,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight,
    Smartphone,
    CreditCard
} from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {

    // Performance Metrics (Wired to institutional registry)
    const orderCount = await prisma.order.count()
    const productCount = await prisma.product.count()
    const ticketCount = (prisma as any).ticket ? await (prisma as any).ticket.count({ where: { status: "OPEN" } }) : 0

    const orders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    })

    const totalRevenue = await prisma.order.aggregate({
        where: { status: "COMPLETED" },
        _sum: { total: true }
    })

    // Social Intelligence Stream
    let socialStats = { followers: 0, reach: 0, engagement: 0, growth: 0 }
    if (process.env.FACEBOOK_PAGE_ID) {
        try {
            // Internal API call for server-side rendering
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/social-stats`, { cache: 'no-store' })
            socialStats = await res.json()
        } catch (e) {
            console.error("SOCIAL_STREAM_Disconnected")
        }
    }

    return (
        <div className="space-y-12">

            {/* Section Header */}
            <div>
                <h1 className="text-4xl font-black tracking-tight uppercase mb-2">Operational Overview</h1>
                <p className="text-white/30 text-xs font-bold uppercase tracking-[0.3em]">Real-time Institutional Data Streams</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    label="Total Revenue"
                    value={`₨ ${(totalRevenue._sum.total || 0).toLocaleString()}`}
                    trend="+12.5%"
                    trendUp={true}
                    icon={<CreditCard />}
                />
                <KPICard
                    label="Active Orders"
                    value={orderCount.toString()}
                    trend="+4"
                    trendUp={true}
                    icon={<ShoppingCart />}
                />
                <KPICard
                    label="Inventory Hub"
                    value={productCount.toString()}
                    trend="Low Stock: 2"
                    trendUp={false}
                    icon={<Package />}
                />
                <KPICard
                    label="Support Load"
                    value={ticketCount.toString()}
                    trend="Wait time: 14m"
                    trendUp={true}
                    icon={<MessageSquare />}
                />

                {process.env.FACEBOOK_PAGE_ID && (
                    <KPICard
                        label="Social Reach"
                        value={socialStats.followers > 1000 ? `${(socialStats.followers / 1000).toFixed(1)}K` : socialStats.followers.toString()}
                        icon={<ArrowUpRight className="text-blue-500" />}
                        trend={`+${socialStats.growth}%`}
                        trendUp={true}
                    />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Recent Purchases */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">RECENT TRANSACTIONS</h3>
                        <Link href="/admin/orders">
                            <button className="text-[9px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">View All</button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <Link key={order.id} href={`/admin/orders/${order.id}`}>
                                <div className="p-6 bg-[#080808] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer mb-4">
                                    <div className="flex items-center gap-6">
                                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                            <ShoppingCart className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/40 uppercase mb-1">{order.id.slice(-8)} • {order.user.name || "Anonymous"}</p>
                                            <h4 className="text-sm font-black uppercase tracking-tight italic text-white group-hover:text-primary transition-colors">Rs. {order.total.toLocaleString()}</h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black tracking-[0.2em] uppercase ${order.status === "COMPLETED" ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                                            }`}>
                                            {order.status}
                                        </span>
                                        <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* System Alerts */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">HUB NOTIFICATIONS</h3>
                    </div>

                    <div className="space-y-4">
                        <AlertCard
                            type="STOCK"
                            title="IPhone 15 Pro Low"
                            desc="Only 2 units remaining in Seeduwa hub."
                        />
                        <AlertCard
                            type="SUPPORT"
                            title="High VIP Volume"
                            desc="Institutional support load elevated by 25%."
                        />
                        <AlertCard
                            type="SECURITY"
                            title="New Admin Session"
                            desc="Chithila Manul logged in from Colombo."
                        />
                    </div>
                </div>

            </div>

        </div>
    )
}

function KPICard({ label, value, trend, trendUp, icon }: { label: string, value: string, trend: string, trendUp: boolean, icon: any }) {
    return (
        <Card className="bg-[#080808] border-white/5 rounded-[32px] overflow-hidden group hover:border-primary/20 transition-all">
            <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        {icon}
                    </div>
                    <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${trendUp ? "text-green-500" : "text-red-500"}`}>
                        {trend}
                        {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    </div>
                </div>
                <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">{label}</p>
                    <p className="text-3xl font-black tracking-tighter italic">{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function AlertCard({ type, title, desc }: { type: string, title: string, desc: string }) {
    return (
        <div className="p-6 bg-[#080808] border-l-2 border-primary/40 rounded-r-3xl space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[8px] font-black text-primary tracking-[0.4em] uppercase italic">{type}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
            <h5 className="text-[10px] font-black uppercase text-white/80">{title}</h5>
            <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest leading-relaxed">
                {desc}
            </p>
        </div>
    )
}
