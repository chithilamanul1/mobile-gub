"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface TradeInQuoteModalProps {
    ticketId: string
    userEmail: string
    initialDeviceName?: string
}

export function TradeInQuoteModal({ ticketId, userEmail, initialDeviceName = "" }: TradeInQuoteModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [quoteAmount, setQuoteAmount] = useState("")
    const [deviceName, setDeviceName] = useState(initialDeviceName)
    const [validUntil, setValidUntil] = useState(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    ) // Default +7 days

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch("/api/admin/trade-in/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticketId,
                    userEmail,
                    quoteAmount,
                    deviceName,
                    validUntil
                })
            })

            if (!res.ok) throw new Error("Failed to generate quote")

            toast.success("Quote generated & emailed to user")
            setIsOpen(false)
        } catch (error) {
            toast.error("Failed to generate quote")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary">
                    <FileText className="w-4 h-4" />
                    GENERATE QUOTE
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/95 border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold uppercase tracking-widest text-primary">
                        Generate Official Quote
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleGenerate} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label className="uppercase text-xs font-bold text-gray-500">Device Model</Label>
                        <Input
                            value={deviceName}
                            onChange={(e) => setDeviceName(e.target.value)}
                            className="bg-white/5 border-white/10"
                            placeholder="e.g. iPhone 14 Pro Max 256GB"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="uppercase text-xs font-bold text-gray-500">Quote Value (LKR)</Label>
                        <Input
                            type="number"
                            value={quoteAmount}
                            onChange={(e) => setQuoteAmount(e.target.value)}
                            className="bg-white/5 border-white/10 text-2xl font-mono text-primary"
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="uppercase text-xs font-bold text-gray-500">Valid Until</Label>
                        <Input
                            type="date"
                            value={validUntil}
                            onChange={(e) => setValidUntil(e.target.value)}
                            className="bg-white/5 border-white/10"
                            required
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/5 text-gray-400"
                        >
                            CANCEL
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary text-black font-bold hover:bg-primary/90"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    GENERATING PDF...
                                </>
                            ) : (
                                "SEND QUOTE PDF"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
