"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { FaPaperPlane, FaShieldAlt } from "react-icons/fa"

export function Newsletter() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setLoading(true)
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            if (res.ok) {
                toast.success("Welcome to the inner circle.")
                setEmail("")
            } else {
                toast.error("Subscription failed. Please try again.")
            }
        } catch (error) {
            toast.error("Connection error. Try later.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="py-24 bg-surface border-y border-white/5 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                            <FaShieldAlt className="text-[8px]" />
                            Boutique Intelligence
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight italic leading-none">
                            Stay Ahead of the <span className="text-primary">Inventory.</span>
                        </h2>
                        <p className="text-white/40 text-sm font-medium uppercase tracking-widest max-w-md">
                            Get exclusive institutional alerts on flagship drops, pre-owned excellence and luxury accessories.
                        </p>
                    </div>

                    <div className="w-full md:w-[400px]">
                        <form onSubmit={handleSubscribe} className="relative group">
                            <Input
                                type="email"
                                placeholder="YOUR VAULT EMAIL..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-16 bg-background/50 border-white/10 rounded-[30px] pl-8 pr-32 text-sm font-black uppercase tracking-widest focus:border-primary/40 focus:ring-0 transition-all placeholder:text-white/10"
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 top-2 bottom-2 px-6 rounded-[24px] bg-primary text-black font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
                            >
                                {loading ? "..." : "JOIN"}
                                <FaPaperPlane className="ml-2 text-[10px]" />
                            </Button>
                        </form>
                        <p className="mt-4 text-[9px] font-bold text-white/10 text-center uppercase tracking-[0.2em]">
                            NO SPAM. ONLY PURE INSTITUTIONAL UPDATES.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
