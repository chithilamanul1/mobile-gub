import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function StaffChat() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px] gap-4">
            {/* Chat List */}
            <Card className="col-span-1 border-white/10 glass-dark">
                <CardHeader className="pb-3 border-b border-white/10">
                    <CardTitle className="text-sm">Active Conversations</CardTitle>
                </CardHeader>
                <ScrollArea className="h-[500px]">
                    <div className="p-2 space-y-2">
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 cursor-pointer">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-sm">Visitor #4829</span>
                                <Badge variant="outline" className="text-[10px] border-green-500 text-green-500">Live</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">Is the iPhone 15 Pro in stock?</p>
                        </div>
                        {/* More mocked items */}
                    </div>
                </ScrollArea>
            </Card>

            {/* Chat Window */}
            <Card className="col-span-2 border-white/10 glass-dark flex flex-col">
                <CardHeader className="py-3 border-b border-white/10 flex flex-row justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="font-bold">Visitor #4829</span>
                    </div>
                    <Badge variant="secondary">Product Inquiry</Badge>
                </CardHeader>
                <div className="flex-1 bg-black/20 p-4">
                    {/* Chat messages would go here */}
                    <div className="flex justify-start mb-4">
                        <div className="bg-muted p-3 rounded-2xl rounded-bl-none max-w-[80%] text-sm">
                            Is the iPhone 15 Pro in stock?
                        </div>
                    </div>
                    <div className="flex justify-end mb-4">
                        <div className="bg-primary text-black p-3 rounded-2xl rounded-br-none max-w-[80%] text-sm font-medium">
                            Yes, we have 5 units available right now in Blue Titanium.
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-white/10">
                    <input
                        type="text"
                        placeholder="Type a reply..."
                        className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </Card>
        </div>
    )
}
