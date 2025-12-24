import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import {
    MessageSquare,
    User,
    Clock,
    AlertCircle,
    CheckCircle2,
    Send,
    ArrowLeft,
    Shield
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TicketReplyForm } from "./TicketReplyForm"
import { TradeInQuoteModal } from "@/components/admin/TradeInQuoteModal"

export default async function AdminTicketDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const session = await auth()

    const ticket = await (prisma as any).ticket.findUnique({
        where: { id },
        include: {
            user: true,
            messages: {
                orderBy: { createdAt: 'asc' }
            }
        }
    })

    if (!ticket) {
        notFound()
    }

    return (
        <div className="space-y-12">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <Link href="/admin/tickets" className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Registry</span>
                </Link>
                <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border ${ticket.status === 'OPEN' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-white/5 text-white/20 border-white/5'
                        }`}>
                        {ticket.status}
                    </span>
                    <span className={`text-[10px] font-black tracking-widest uppercase ${ticket.priority === 'VIP' ? 'text-red-500' : 'text-primary'
                        }`}>
                        {ticket.priority} PRIORITY
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Conversation Hub */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="w-8 h-[2px] bg-primary" />
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase font-sans">Support Stream</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight uppercase italic">{ticket.subject}</h1>
                        <p className="text-white/40 text-sm leading-relaxed max-w-2xl">{ticket.description}</p>
                    </div>

                    {/* Messages List */}
                    <div className="space-y-6 pt-12 border-t border-white/5">
                        {ticket.messages.map((msg: any) => (
                            <div key={msg.id} className={`flex ${msg.senderRole === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] space-y-2`}>
                                    <div className={`p-6 rounded-3xl text-sm font-medium leading-relaxed ${msg.senderRole === 'ADMIN'
                                        ? 'bg-primary text-black rounded-tr-none'
                                        : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    <div className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/20 ${msg.senderRole === 'ADMIN' ? 'justify-end' : 'justify-start'
                                        }`}>
                                        {msg.senderRole === 'ADMIN' && <Shield className="w-2 h-2 text-primary" />}
                                        {msg.senderRole === 'ADMIN' ? 'Institutional Staff' : ticket.user.name}
                                        <span>•</span>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reply Form (Client Component) */}
                    <div className="pt-12 border-t border-white/5">
                        <TicketReplyForm ticketId={ticket.id} />
                    </div>
                </div>

                {/* Sidebar Context */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="bg-[#080808] border-white/5 rounded-[40px] overflow-hidden">
                        <div className="p-8 space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary mb-6">CLIENT IDENTITY</h3>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-tight italic">{ticket.user.name}</p>
                                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{ticket.user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">REGISTRY DATE</span>
                                    <span className="text-[9px] font-bold text-white uppercase">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">TICKET ID</span>
                                    <span className="text-[9px] font-bold text-white uppercase">{ticket.id.slice(0, 8)}...</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20 rounded-[40px] overflow-hidden">
                        <div className="p-8 space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                                <AlertCircle className="w-4 h-4" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest">Staff Guidelines</h4>
                            </div>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                                Maintain institutional tone. Prioritize VIP escalations. All replies are logged in the secure support registry.
                            </p>
                        </div>
                    </Card>

                    {/* Trade-In Action Panel */}
                    {ticket.subject.includes("Trade-In") && (
                        <Card className="bg-black border border-white/10 rounded-[40px] overflow-hidden">
                            <div className="p-8 space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <Shield className="w-4 h-4" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest">Valuation Actions</h4>
                                </div>
                                <p className="text-[10px] text-gray-500 mb-4">
                                    Generate an official PDF quote and email it directly to the customer.
                                </p>
                                <TradeInQuoteModal
                                    ticketId={ticket.id}
                                    userEmail={ticket.user.email!}
                                    initialDeviceName={ticket.subject.replace("Trade-In Quote: ", "")}
                                />
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
