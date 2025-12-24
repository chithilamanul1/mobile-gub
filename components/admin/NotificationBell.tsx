"use client"

import { useState, useEffect } from "react"
import { Bell, Check } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Notification = {
    id: string
    type: string
    title: string
    message: string
    read: boolean
    createdAt: string
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/admin/notifications")
            if (res.ok) {
                const data = await res.json()
                setNotifications(data.notifications)
                setUnreadCount(data.unreadCount)
            }
        } catch (e) {
            console.error(e)
        }
    }

    // Initial fetch and polling every 30s
    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    const markAllRead = async () => {
        try {
            await fetch("/api/admin/notifications", { method: "PUT" })
            setUnreadCount(0)
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button className="p-2 text-white/40 hover:text-white transition-colors relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-[#050505]" />
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-[#080808] border-white/10" align="end">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllRead}
                            className="h-auto p-0 text-[10px] font-bold text-primary hover:text-white hover:bg-transparent"
                        >
                            MARK ALL READ
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-white/20 text-xs">
                            No new alerts.
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {notifications.map((n) => (
                                <div key={n.id} className={cn("p-4 hover:bg-white/5 transition-colors", !n.read && "bg-white/[0.02]")}>
                                    <div className="flex items-start gap-3">
                                        <div className={cn("w-1.5 h-1.5 mt-1.5 rounded-full", !n.read ? "bg-primary" : "bg-white/10")} />
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-wide text-white/60">{n.type}</p>
                                            <p className="text-xs font-bold text-white">{n.title}</p>
                                            <p className="text-[10px] text-white/40 leading-relaxed">{n.message}</p>
                                            <p className="text-[8px] text-white/20 pt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
