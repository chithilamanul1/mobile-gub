"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Smartphone, CheckCircle, Loader2 } from "lucide-react"

export function TradeInForm() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            const res = await fetch("/api/trade-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                setSuccess(true)
                toast.success("Quote request submitted successfully!")
            } else {
                throw new Error("Failed to submit")
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase text-white tracking-tight">Request Received!</h3>
                    <p className="text-gray-400 font-medium">
                        Our team will evaluate your device and send a preliminary quote to your email within 24 hours.
                    </p>
                </div>
                <Button
                    onClick={() => setSuccess(false)}
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 text-white"
                >
                    Submit Another Device
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/10 p-8 md:p-12 rounded-[32px]">
            <div className="space-y-2 mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">Get Your Quote</h3>
                <p className="text-gray-400 text-sm font-medium">Fill in the details for an instant evaluation queue.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="uppercase text-[10px] tracking-widest text-gray-400 font-bold">Brand</Label>
                    <Select name="brand" required>
                        <SelectTrigger className="bg-black/20 border-white/10 h-12 rounded-xl text-white">
                            <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10">
                            <SelectItem value="Apple">Apple</SelectItem>
                            <SelectItem value="Samsung">Samsung</SelectItem>
                            <SelectItem value="Google">Google</SelectItem>
                            <SelectItem value="OnePlus">OnePlus</SelectItem>
                            <SelectItem value="Xiaomi">Xiaomi</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="uppercase text-[10px] tracking-widest text-gray-400 font-bold">Model</Label>
                    <Input
                        name="model"
                        placeholder="e.g. iPhone 14 Pro Max"
                        required
                        className="bg-black/20 border-white/10 h-12 rounded-xl text-white placeholder:text-gray-600"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="uppercase text-[10px] tracking-widest text-gray-400 font-bold">Storage</Label>
                    <Select name="storage" required>
                        <SelectTrigger className="bg-black/20 border-white/10 h-12 rounded-xl text-white">
                            <SelectValue placeholder="Select Storage" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10">
                            <SelectItem value="64GB">64GB</SelectItem>
                            <SelectItem value="128GB">128GB</SelectItem>
                            <SelectItem value="256GB">256GB</SelectItem>
                            <SelectItem value="512GB">512GB</SelectItem>
                            <SelectItem value="1TB">1TB</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="uppercase text-[10px] tracking-widest text-gray-400 font-bold">Condition</Label>
                    <Select name="condition" required>
                        <SelectTrigger className="bg-black/20 border-white/10 h-12 rounded-xl text-white">
                            <SelectValue placeholder="Select Condition" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-white/10">
                            <SelectItem value="Pristine">Pristine (Like New)</SelectItem>
                            <SelectItem value="Excellent">Excellent (Minor Usage)</SelectItem>
                            <SelectItem value="Good">Good (Visible Wear)</SelectItem>
                            <SelectItem value="Cracked">Cracked/Damaged</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="uppercase text-[10px] tracking-widest text-gray-400 font-bold">Defects / Notes</Label>
                <Textarea
                    name="defects"
                    placeholder="Describe any scratches, battery health, or functional issues..."
                    className="bg-black/20 border-white/10 min-h-[100px] rounded-xl text-white placeholder:text-gray-600"
                />
            </div>

            <div className="h-px bg-white/10 my-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="uppercase text-[10px] tracking-widest text-gray-400 font-bold">Your Name</Label>
                    <Input
                        name="name"
                        required
                        className="bg-black/20 border-white/10 h-12 rounded-xl text-white placeholder:text-gray-600"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="uppercase text-[10px] tracking-widest text-gray-400 font-bold">Phone Number</Label>
                    <Input
                        name="phone"
                        required
                        type="tel"
                        className="bg-black/20 border-white/10 h-12 rounded-xl text-white placeholder:text-gray-600"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label className="uppercase text-[10px] tracking-widest text-gray-400 font-bold">Email Address</Label>
                    <Input
                        name="email"
                        required
                        type="email"
                        className="bg-black/20 border-white/10 h-12 rounded-xl text-white placeholder:text-gray-600"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest h-14 rounded-xl text-sm transition-all shadow-lg shadow-primary/20"
            >
                {loading ? <Loader2 className="animate-spin" /> : "Request Quote"}
            </Button>
        </form>
    )
}
