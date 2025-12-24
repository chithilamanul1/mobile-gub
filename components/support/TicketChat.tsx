"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Shield, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
    id: string
    content: string
    senderRole: "USER" | "ADMIN"
    createdAt: string
}

interface Ticket {
    id: string
    subject: string
    description: string
    status: string
    priority: string
    messages: Message[]
}

export default function TicketChat({ ticketId }: { ticketId: string }) {
    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [newMessage, setNewMessage] = useState("")
    const [sending, setSending] = useState(false)
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchTicket()
        const interval = setInterval(fetchTicket, 5000) // Poll every 5s
        return () => clearInterval(interval)
    }, [ticketId])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [ticket?.messages])

    const fetchTicket = async () => {
        try {
            const res = await fetch(`/api/tickets/${ticketId}/messages`)
            if (res.ok) {
                const data = await res.json()
                setTicket(data)
            }
        } catch (error) {
            console.error("FETCH_TICKET_ERROR", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || sending) return

        setSending(true)
        try {
            const res = await fetch(`/api/tickets/${ticketId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage })
            })

            if (res.ok) {
                setNewMessage("")
                fetchTicket()
            }
        } catch (error) {
            console.error("SEND_MESSAGE_ERROR", error)
        } finally {
            setSending(false)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Opening Support Vault...</p>
        </div>
    )

    if (!ticket) return (
        <div className="text-center py-40">
            <p className="text-red-500 font-black uppercase tracking-widest">Unauthorized Access or Ticket Not Found</p>
        </div>
    )

    return (
        <div className="space-y-12">
            {/* Ticket Stats Header */}
            <div className="p-8 bg-gray-50 dark:bg-[#050505] rounded-[32px] border border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary tracking-widest uppercase">Support Request • {ticket.id.slice(0, 8)}</p>
                    <h1 className="text-2xl font-black tracking-tight uppercase">{ticket.subject}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border ${ticket.status === 'OPEN'
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                        }`}>
                        {ticket.status}
                    </div>
                    <div className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black tracking-widest uppercase">
                        {ticket.priority} PRIORITY
                    </div>
                </div>
            </div>

            {/* Chat Interface */}
            <div
                ref={scrollRef}
                className="space-y-8 h-[500px] overflow-y-auto px-4 custom-scrollbar"
            >
                {/* Initial Description */}
                <div className="flex items-start gap-4 flex-row-reverse">
                    <div className="h-12 w-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="max-w-[70%] space-y-2 items-end">
                        <div className="p-6 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-[24px] rounded-tr-none text-sm font-medium leading-relaxed">
                            {ticket.description}
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {ticket.messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-start gap-4 ${m.senderRole === 'USER' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${m.senderRole === 'USER'
                                    ? 'bg-black dark:bg-white text-white dark:text-black'
                                    : 'bg-primary text-black'
                                }`}>
                                {m.senderRole === 'USER' ? <User className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                            </div>

                            <div className={`max-w-[70%] space-y-2 ${m.senderRole === 'USER' ? 'items-end' : ''}`}>
                                <div className={`p-6 rounded-[24px] text-sm font-medium leading-relaxed ${m.senderRole === 'USER'
                                        ? 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-tr-none border border-transparent'
                                        : 'bg-primary/10 text-gray-900 dark:text-white border border-primary/20 rounded-tl-none'
                                    }`}>
                                    {m.content}
                                </div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Reply Box */}
            <form onSubmit={handleSend} className="sticky bottom-10 p-4 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 rounded-[32px] shadow-2xl">
                <div className="flex items-center gap-4">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="TYPE YOUR MESSAGE TO THE HUB..."
                        className="bg-transparent border-none focus-visible:ring-0 text-xs font-bold tracking-widest uppercase h-14"
                        disabled={sending}
                    />
                    <Button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="h-14 w-14 bg-black dark:bg-primary text-white dark:text-black rounded-2xl shrink-0 group transition-all"
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                    </Button>
                </div>
            </form>
        </div>
    )
}
