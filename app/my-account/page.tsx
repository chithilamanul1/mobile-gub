import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Package,
    ShieldCheck,
    Settings,
    MessageSquare,
    LogOut,
    Smartphone,
    CreditCard,
    Headset
} from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { SignOutButton } from "@/components/auth/SignOutButton"

export default async function UserDashboard() {
    const session = await auth()

    if (!session?.user) {
        redirect("/auth/signin")
    }

    const userEmail = session.user.email!

    // Fetch user with orders (orders relation existed before the lock)
    const user = await (prisma as any).user.findUnique({
        where: { email: userEmail },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            orders: true
        }
    })

    if (!user) return redirect("/")

    // Fetch tickets separately since the 'tickets' relation on 'User' is missing in the stale client
    // Defensive check to avoid crash if the 'ticket' model itself is missing from the stale client
    const tickets = (prisma as any).ticket
        ? await (prisma as any).ticket.findMany({ where: { userId: (user as any).id } })
        : []

    const orderCount = (user as any)?.orders?.length || 0
    const ticketCount = tickets?.length || 0
    const openTicketsCount = tickets?.filter((t: any) => t.status === 'OPEN').length || 0

    return (
        <div className="bg-white dark:bg-black min-h-screen text-gray-900 dark:text-white pt-32 pb-40">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Premium Header */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 p-10 bg-gray-50 dark:bg-[#050505] rounded-[40px] border border-gray-100 dark:border-white/5 relative overflow-hidden">
                    <div className="flex items-center gap-8 relative z-10 text-center md:text-left">
                        {session.user.image ? (
                            <img src={session.user.image} alt={session.user.name || "User"} className="h-24 w-24 rounded-3xl object-cover shadow-2xl border-4 border-primary/20" />
                        ) : (
                            <div className="h-24 w-24 rounded-3xl bg-primary flex items-center justify-center text-4xl font-black text-black shadow-2xl shadow-primary/20">
                                {session.user.name?.[0] || "U"}
                            </div>
                        )}
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase">
                                VIP Member
                            </div>
                            <h1 className="text-4xl font-black tracking-tight uppercase leading-none">
                                {session.user.name || "Authenticated Member"}
                            </h1>
                            <p className="text-gray-400 dark:text-white/30 text-xs font-bold uppercase tracking-widest">
                                {session.user.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 relative z-10 w-full md:w-auto">
                        <Link href="/my-account/settings" className="flex-1">
                            <Button variant="outline" className="w-full h-14 rounded-2xl border-gray-200 dark:border-white/10 px-8 font-black text-[10px] tracking-widest uppercase hover:bg-white dark:hover:bg-white/5">
                                <Settings className="w-4 h-4 mr-2" /> SETTINGS
                            </Button>
                        </Link>
                        <SignOutButton />
                    </div>

                    {/* Decorative Atmosphere */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48" />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-3 space-y-4">
                        <Link href="/my-account" className="block">
                            <DashboardLink icon={<Package />} label="PURCHASES" active={true} />
                        </Link>
                        <Link href="/my-account" className="block">
                            <DashboardLink icon={<Smartphone />} label="MY DEVICES" />
                        </Link>
                        <Link href="/my-account/tickets" className="block">
                            <DashboardLink icon={<Headset />} label="PRIORITY SUPPORT" />
                        </Link>
                        <Link href="/my-account" className="block">
                            <DashboardLink icon={<CreditCard />} label="TRANSACTIONS" />
                        </Link>

                        <div className="mt-12 p-8 bg-black dark:bg-primary/5 rounded-[32px] border border-white/5 space-y-4">
                            <ShieldCheck className="text-primary text-3xl" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Certified Status</p>
                            <p className="text-[10px] font-medium text-white/40 leading-relaxed uppercase">
                                Your account is technical verified for priority flagship allocations.
                            </p>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="lg:col-span-9 space-y-12">

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard label="Total Orders" value={orderCount.toString()} />
                            <StatCard label="Active Assets" value="0" />
                            <StatCard label="Open Tickets" value={openTicketsCount.toString()} color="text-primary" />
                        </div>

                        {/* Detailed View */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-8">
                                <h2 className="text-xl font-black tracking-widest uppercase">Ongoing Activities</h2>
                                <Button variant="ghost" className="text-[10px] font-black tracking-widest uppercase text-primary">View History</Button>
                            </div>

                            <div className="grid gap-6">
                                {/* Empty State / Placeholder */}
                                <Link href="/shop" className="group p-16 text-center bg-gray-50 dark:bg-white/5 rounded-[32px] border border-dashed border-gray-200 dark:border-white/10 block hover:border-primary/30 transition-all">
                                    <Smartphone className="w-12 h-12 mx-auto mb-6 text-gray-200 dark:text-white/10 group-hover:text-primary transition-colors" />
                                    <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 group-hover:text-white transition-colors">Start your flagship collection</p>
                                    <p className="text-[10px] font-bold text-gray-300 dark:text-white/20 mt-2 uppercase tracking-widest">Explore THE CERTIFIED inventory</p>
                                </Link>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    )
}

function DashboardLink({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all border border-transparent ${active
            ? "bg-black dark:bg-white text-white dark:text-black shadow-xl translate-x-1"
            : "text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer"
            }`}>
            <span className="text-xl">{icon}</span>
            <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
        </div>
    )
}

function StatCard({ label, value, color = "text-gray-900 dark:text-white" }: { label: string, value: string, color?: string }) {
    return (
        <div className="p-10 bg-white dark:bg-[#080808] border border-gray-100 dark:border-white/5 rounded-[32px] shadow-sm space-y-4">
            <p className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">{label}</p>
            <p className={`text-5xl font-black tracking-tighter ${color}`}>{value}</p>
        </div>
    )
}
