"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function POSPage() {
    const [isLoading, setIsLoading] = useState(true)
    const POS_URL = "https://mobilehub.work/axenodigitalpos/POS/public/home"

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Point of Sale</h1>
                    <p className="text-muted-foreground">
                        Access your external POS system directly from here.
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <a href={POS_URL} target="_blank" rel="noopener noreferrer">
                        Open in New Tab <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </div>

            <Card className="flex-1 overflow-hidden border-0 relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Connecting to POS...</p>
                        </div>
                    </div>
                )}
                <iframe
                    src={POS_URL}
                    className="w-full h-full border-0"
                    onLoad={() => setIsLoading(false)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </Card>
        </div>
    )
}
