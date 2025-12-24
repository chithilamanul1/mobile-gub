"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function TrackOrderPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">("idle")
    const [orderData, setOrderData] = useState<any>(null)

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("loading")

        // Mock API Call - Replace with real fetch
        setTimeout(() => {
            // Simulate success
            setStatus("found")
            setOrderData({
                id: "ORD-88219-X",
                date: "Dec 22, 2025",
                status: "SHIPPED",
                steps: [
                    { label: "Order Placed", date: "Dec 22, 10:00 AM", completed: true },
                    { label: "Processing", date: "Dec 22, 02:00 PM", completed: true },
                    { label: "Shipped", date: "Dec 23, 09:00 AM", completed: true },
                    { label: "Delivered", date: "Estimated Dec 24", completed: false },
                ]
            })
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">

                <div className="text-center mb-12 space-y-4">
                    <span className="text-primary font-black tracking-widest text-[10px] uppercase">Logistics Center</span>
                    <h1 className="text-5xl font-black tracking-tight uppercase">Track Your Order</h1>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 mb-12">
                    <form onSubmit={handleTrack} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Order ID</Label>
                                <Input placeholder="e.g. ORD-123456" className="h-14 bg-black/50 border-white/10 rounded-xl text-white placeholder:text-white/20" required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</Label>
                                <Input type="email" placeholder="Used during checkout" className="h-14 bg-black/50 border-white/10 rounded-xl text-white placeholder:text-white/20" required />
                            </div>
                        </div>
                        <Button className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/90 rounded-xl text-xs">
                            {status === "loading" ? "Locating Shipment..." : "Track Shipment"}
                        </Button>
                    </form>
                </div>

                {status === "found" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12"
                    >
                        <div className="flex justify-between items-start mb-12 border-b border-white/10 pb-8">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Order Reference</p>
                                <p className="text-2xl font-black text-white">{orderData.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Current Status</p>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-black uppercase mt-1">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    {orderData.status}
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                            {orderData.steps.map((step: any, i: number) => (
                                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/20 bg-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xs">
                                        {step.completed && <div className="w-2 h-2 bg-primary rounded-full" />}
                                    </div>
                                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-white/5">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-white text-sm">{step.label}</div>
                                            <time className="font-mono text-[10px] text-gray-500">{step.date}</time>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
