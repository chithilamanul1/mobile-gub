import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus, MessageCircle, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function TicketsPage() {
    const session = await auth()
    if (!session?.user) redirect("/auth/signin")

    const user = await (prisma as any).user.findUnique({
        where: { email: session.user.email! }
    })

    const tickets = (user && (prisma as any).ticket) ? await (prisma as any).ticket.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    }) : []

    return (
        <div className="bg-white dark:bg-black min-h-screen text-gray-900 dark:text-white pt-32 pb-40">
            <div className="container mx-auto px-6 max-w-5xl space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-white/5 pb-12">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 text-primary">
                            <div className="w-8 h-[2px] bg-primary" />
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase">PRIORITY SUPPORT</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight uppercase leading-none">
                            Support Vault
                        </h1>
                        <p className="text-gray-400 dark:text-white/30 text-xs font-bold uppercase tracking-widest">
                            Direct line to our technical excellence team.
                        </p>
                    </div>

                    <Link href="/my-account/tickets/new">
                        <Button className="h-16 bg-black dark:bg-white text-white dark:text-black hover:bg-primary rounded-2xl px-10 font-black text-xs tracking-widest uppercase shadow-xl group">
                            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> OPEN NEW TICKET
                        </Button>
                    </Link>
                </div>

                {/* Ticket Grid/List */}
                <div className="grid gap-6">
                    {tickets.map((t: any) => (
                        <Link key={t.id} href={`/my-account/tickets/${t.id}`}>
                            <div className="group p-8 bg-gray-50 dark:bg-[#080808] border border-gray-100 dark:border-white/5 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8 hover:border-primary/30 transition-all hover:translate-x-1">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-primary border border-gray-100 dark:border-white/10 shadow-sm">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1 text-center md:text-left">
                                        <p className="text-[10px] font-black text-primary tracking-widest uppercase mb-1">{t.id.slice(0, 8)} • {t.priority}</p>
                                        <h3 className="text-lg font-black tracking-tight uppercase group-hover:text-primary transition-colors">{t.subject}</h3>
                                        <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(t.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase ${t.status === 'OPEN'
                                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                        : "bg-gray-500/10 text-gray-500"
                                        }`}>
                                        {t.status}
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                                        <Plus className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {tickets.length === 0 && (
                        <div className="py-32 text-center bg-gray-50 dark:bg-white/5 rounded-[40px] border border-dashed border-gray-200 dark:border-white/10 text-center">
                            <p className="text-gray-400 uppercase tracking-[0.5em] font-black text-xs text-center">No active tickets.</p>
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="p-10 bg-black dark:bg-[#050505] rounded-[40px] border border-white/5 flex flex-col md:flex-row items-center gap-8">
                    <CheckCircle2 className="text-primary text-4xl" />
                    <div className="space-y-2 text-center md:text-left">
                        <h4 className="text-white font-black tracking-widest uppercase text-sm">Response Guarantee</h4>
                        <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider leading-relaxed">
                            Our technical specialists usually respond within 60 minutes during institutional hours (9AM - 6PM).
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
