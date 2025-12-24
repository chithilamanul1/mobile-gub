"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaPalette, FaFont, FaMoon, FaSun } from "react-icons/fa"
import { MdViewCompact, MdViewStream } from "react-icons/md"

export function AdvancedThemeSwitcher() {
    const [theme, setTheme] = useState("modern")
    const [open, setOpen] = useState(false)

    useEffect(() => {
        // Apply theme class to root
        document.documentElement.className = `dark theme-${theme}`
    }, [theme])

    const themes = [
        { id: "modern", name: "Modern Glass", desc: "Glassmorphism & rounded" },
        { id: "minimal", name: "Minimal Flat", desc: "Clean & sharp edges" },
        { id: "classic", name: "Classic Dense", desc: "Compact & traditional" }
    ]

    return (
        <>
            {/* Floating Theme Button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-primary text-black shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
                aria-label="Theme Switcher"
            >
                <FaPalette className="w-6 h-6" />
            </button>

            {/* Theme Switcher Panel */}
            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
                    <Card className="glass-dark border-white/10 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FaPalette className="text-primary" />
                                Theme Customization
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <MdViewCompact className="text-primary" />
                                    Design Style
                                </h3>
                                <div className="space-y-2">
                                    {themes.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTheme(t.id)}
                                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${theme === t.id
                                                    ? "border-primary bg-primary/10"
                                                    : "border-white/10 hover:border-white/30"
                                                }`}
                                        >
                                            <div className="font-bold">{t.name}</div>
                                            <div className="text-sm text-muted-foreground">{t.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 text-center text-sm text-muted-foreground">
                                Changes apply instantly to fonts, shapes, spacing & layout
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}
