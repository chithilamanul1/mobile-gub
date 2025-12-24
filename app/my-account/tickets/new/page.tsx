"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function NewTicketPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("NORMAL")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, description, priority })
            })

            if (res.ok) {
                router.push("/my-account/tickets")
                router.refresh()
            }
        } catch (error) {
            console.error("FAILED_TO_OPEN_TICKET", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-black min-h-screen text-gray-900 dark:text-white pt-32 pb-40">
            <div className="container mx-auto px-6 max-w-3xl space-y-12">

                {/* Back Link */}
                <Link href="/my-account/tickets" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
                    <ArrowLeft className="w-3 h-3" /> Back to Vault
                </Link>

                <div className="space-y-4">
                    <h1 className="text-5xl font-black tracking-tight uppercase leading-none">Open Support Request</h1>
                    <p className="text-gray-400 dark:text-white/30 text-xs font-bold uppercase tracking-widest">
                        Submit your technical query for institutional review.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 p-10 bg-gray-50 dark:bg-[#050505] rounded-[40px] border border-gray-100 dark:border-white/5 relative overflow-hidden">
                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Request Subject</label>
                            <Input
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="E.G. WARRANTY VERIFICATION, TRADE-IN QUERY..."
                                className="h-14 bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 rounded-2xl px-6 text-xs font-bold uppercase tracking-widest placeholder:text-gray-300 dark:placeholder:text-white/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Technical Details</label>
                            <Textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="DESCRIBE YOUR ISSUE IN DETAIL..."
                                className="min-h-[200px] bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 rounded-2xl p-6 text-xs font-bold uppercase tracking-widest placeholder:text-gray-300 dark:placeholder:text-white/10"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Priority Tier</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full h-14 bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest appearance-none focus:outline-none focus:border-primary transition-colors"
                                >
                                    <option value="NORMAL">NORMAL</option>
                                    <option value="URGENT">URGENT</option>
                                    <option value="VIP">VIP PRIORITY</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-8">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-black dark:bg-white text-white dark:text-black hover:bg-primary rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-xl group"
                            >
                                {loading ? "TRANSMITTING..." : "SUBMIT TO SUPPORT VAULT"}
                                <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-32 -mt-32" />
                </form>

                <div className="p-8 bg-primary/5 border border-primary/20 rounded-[32px] flex gap-6 items-center">
                    <ShieldAlert className="text-primary text-2xl shrink-0" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-loose">
                        Please include IMEI numbers for device-specific queries to expedite technical verification.
                    </p>
                </div>

            </div>
        </div>
    )
}
