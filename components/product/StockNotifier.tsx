"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { FaBell } from "react-icons/fa"

export function StockNotifier({ productName }: { productName: string }) {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        toast.success("Request Registered!", {
            description: `We will notify ${email} as soon as ${productName} is back in stock.`
        })
        setLoading(false)
        setEmail("")
    }

    return (
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 space-y-6">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-500">
                    <FaBell className="text-xl" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">Out of Stock</h3>
                    <p className="text-sm text-gray-400">
                        This item is currently sold out due to high demand. Join the waitlist to get notified instantly when stock arrives.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-4">
                <Input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-black/50 border-white/10 focus:border-yellow-500"
                />
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold uppercase tracking-wider"
                >
                    {loading ? "Saving..." : "Notify Me"}
                </Button>
            </form>
        </div>
    )
}
