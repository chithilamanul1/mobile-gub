"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function TicketReplyForm({ ticketId }: { ticketId: string }) {
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSend = async () => {
        if (!content.trim()) return

        setLoading(true)
        try {
            const res = await fetch(`/api/admin/tickets/${ticketId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            })

            if (res.ok) {
                toast.success("Institutional reply transmitted.")
                setContent("")
                router.refresh()
            } else {
                toast.error("Transmission failure. Check registry.")
            }
        } catch (error) {
            toast.error("Connection lost.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="relative group">
                <Textarea
                    placeholder="ENTER INSTITUTIONAL REPLY..."
                    className="min-h-[150px] bg-[#080808] border-white/10 rounded-[32px] p-8 text-sm font-medium text-white placeholder:text-white/10 focus:border-primary/40 focus:ring-0 transition-all uppercase tracking-widest resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-10 group-focus-within:opacity-40 transition-opacity" />
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleSend}
                    disabled={loading || !content.trim()}
                    className="h-14 px-10 rounded-[20px] bg-primary text-black font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all flex items-center gap-3"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin font-sans" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                    {loading ? "TRANSMITTING..." : "DISPATCH REPLY"}
                </Button>
            </div>
        </div>
    )
}
