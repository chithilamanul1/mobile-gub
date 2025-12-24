"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MessageCircle, User, Bot, Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { usePathname } from "next/navigation"

export function ChatInterface() {
    const pathname = usePathname()
    const [messages, setMessages] = useState<{ role: 'user' | 'agent', text: string }[]>([
        { role: 'agent', text: 'Hello! Welcome to Kaushika Randima Mobile Shop. How can I help you today?' }
    ])
    const [input, setInput] = useState("")
    const [isAgentOnline, setIsAgentOnline] = useState(false) // Toggle this to simulate agent availability

    if (pathname?.startsWith("/admin")) return null

    const handleSend = () => {
        if (!input.trim()) return

        const newMessages = [...messages, { role: 'user' as const, text: input }]
        setMessages(newMessages)
        setInput("")

        if (!isAgentOnline) {
            // Fallback to WhatsApp logic
            setTimeout(() => {
                const whatsappMsg = encodeURIComponent(input)
                window.open(`https://wa.me/9477xxxxxxx?text=${whatsappMsg}`, '_blank')
                setMessages([...newMessages, { role: 'agent', text: 'Our agents are currently offline. Redirecting you to WhatsApp to continue this conversation...' }])
            }, 1000)
        } else {
            // Simulate agent reply
            setTimeout(() => {
                setMessages([...newMessages, { role: 'agent', text: 'Thank you. An agent is checking checking stock for you right now.' }])
            }, 1500)
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 z-40 md:bottom-8" size="icon">
                    <MessageCircle className="h-6 w-6 text-primary-foreground" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[90%] sm:w-[400px] flex flex-col glass-dark border-l-white/10">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/logo-small.png" />
                            <AvatarFallback className="bg-primary text-primary-foreground">KR</AvatarFallback>
                        </Avatar>
                        <div>
                            Live Support
                            <span className="flex items-center gap-1 text-[10px] font-normal text-muted-foreground">
                                <span className={`h-2 w-2 rounded-full ${isAgentOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                {isAgentOnline ? 'Online' : 'Offline (WhatsApp)'}
                            </span>
                        </div>
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1 mt-4 p-4 rounded-lg bg-background/40">
                    <div className="space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                    : 'bg-muted text-foreground rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="mt-4 flex gap-2">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        className="bg-background/50"
                    />
                    <Button onClick={handleSend} size="icon" variant="secondary">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
