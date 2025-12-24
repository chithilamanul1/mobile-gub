"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    FaPalette,
    FaSave,
    FaDownload,
    FaUpload,
    FaTimes,
    FaMagic,
    FaCheck,
    FaChevronRight
} from "react-icons/fa"
import { PRESET_THEMES, generatePalette, getComplementary } from "@/lib/colors"
import { Button } from "@/components/ui/button"

interface Theme {
    name: string
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
}

export function AIThemeSwitcher() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentTheme, setCurrentTheme] = useState<Theme>(PRESET_THEMES.midnight)
    const [customColor, setCustomColor] = useState("#d4af37")

    useEffect(() => {
        const saved = localStorage.getItem('mobile-hub-theme')
        if (saved) {
            try {
                const theme = JSON.parse(saved)
                setCurrentTheme(theme)
                applyStyles(theme)
            } catch (e) {
                console.error('Failed to load theme:', e)
            }
        }
    }, [])

    const applyTheme = (theme: Theme) => {
        setCurrentTheme(theme)
        applyStyles(theme)
        localStorage.setItem('mobile-hub-theme', JSON.stringify(theme))
    }

    const applyStyles = (theme: Theme) => {
        document.documentElement.style.setProperty('--theme-primary', theme.primary)
        document.documentElement.style.setProperty('--theme-secondary', theme.secondary)
        document.documentElement.style.setProperty('--theme-accent', theme.accent)
        document.documentElement.style.setProperty('--theme-background', theme.background)
        document.documentElement.style.setProperty('--theme-surface', theme.surface)
        document.documentElement.style.setProperty('--theme-text', theme.text)
    }

    const generateAITheme = () => {
        const palette = generatePalette(customColor)
        const complementary = getComplementary(customColor)

        const aiTheme: Theme = {
            name: 'AI Elite Concept',
            primary: customColor,
            secondary: complementary,
            accent: palette[300],
            background: palette[900],
            surface: palette[800],
            text: palette[50]
        }

        applyTheme(aiTheme)
    }

    return (
        <>
            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-24 z-[100] w-14 h-14 rounded-full bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-center text-primary group overflow-hidden"
            >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                <FaPalette className="w-5 h-5 relative z-10" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-end justify-end p-8 bg-black/40 backdrop-blur-md"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            className="w-full max-w-md bg-white dark:bg-[#050505] rounded-[40px] border border-gray-100 dark:border-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col h-full max-h-[85vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-primary">
                                        <FaMagic className="w-3 h-3" />
                                        <span className="text-[10px] font-black tracking-[0.4em] uppercase">SYSTEM V2</span>
                                    </div>
                                    <h2 className="text-xl font-black uppercase tracking-tight italic">Elite Theming</h2>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-white/20 hover:text-white transition-colors">
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">

                                {/* Presets Section */}
                                <section className="space-y-6">
                                    <h3 className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">Institutional Presets</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {Object.entries(PRESET_THEMES).map(([key, theme]) => (
                                            <button
                                                key={key}
                                                onClick={() => applyTheme(theme)}
                                                className={`flex items-center justify-between p-5 rounded-[24px] border transition-all relative group ${currentTheme.name === theme.name
                                                    ? 'bg-primary/5 border-primary/20'
                                                    : 'border-white/5 bg-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex -space-x-2">
                                                        <div className="w-8 h-8 rounded-full border-2 border-[#050505]" style={{ backgroundColor: theme.primary }} />
                                                        <div className="w-8 h-8 rounded-full border-2 border-[#050505]" style={{ backgroundColor: theme.accent }} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black uppercase tracking-widest">{theme.name}</p>
                                                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">{key}</p>
                                                    </div>
                                                </div>
                                                {currentTheme.name === theme.name ? (
                                                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-black">
                                                        <FaCheck className="w-3 h-3" />
                                                    </div>
                                                ) : (
                                                    <FaChevronRight className="w-3 h-3 text-white/10 group-hover:translate-x-1 transition-transform" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* AI Logic Section */}
                                <section className="space-y-6 p-8 bg-black rounded-[32px] border border-white/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <h3 className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">Concept Generator</h3>
                                    </div>
                                    <p className="text-[10px] font-medium text-white/20 uppercase leading-relaxed tracking-widest">
                                        Choose a base aesthetic and our engine will craft a luxury palette for your hub.
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="flex-1 relative">
                                            <input
                                                type="color"
                                                value={customColor}
                                                onChange={(e) => setCustomColor(e.target.value)}
                                                className="w-full h-16 rounded-2xl cursor-pointer bg-white/5 border border-white/10 p-1"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <span className="text-[9px] font-black text-white mix-blend-difference uppercase tracking-widest">Pick Basis</span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={generateAITheme}
                                            className="h-16 px-8 bg-primary text-black font-black text-[10px] tracking-widest uppercase rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/10"
                                        >
                                            Inception
                                        </Button>
                                    </div>
                                </section>

                                {/* Theme Metadata */}
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">Theme Identity</h3>
                                        <span className="text-[8px] font-mono text-white/10 uppercase tracking-tighter">V4.92_CORE</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <MetaBlock label="Registry" color={currentTheme.primary} />
                                        <MetaBlock label="Atmosphere" color={currentTheme.background} />
                                        <MetaBlock label="Accent" color={currentTheme.accent} />
                                        <MetaBlock label="Typography" color={currentTheme.text} />
                                    </div>
                                </section>

                            </div>

                            {/* Footer Actions */}
                            <div className="p-8 border-t border-gray-50 dark:border-white/5 flex gap-4 bg-gray-50 dark:bg-white/[0.02]">
                                <Button variant="ghost" onClick={() => localStorage.removeItem('mobile-hub-theme')} className="flex-1 h-12 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white">
                                    Reset
                                </Button>
                                <Button className="flex-1 h-12 rounded-xl bg-white dark:bg-white/10 text-black dark:text-white font-black text-[9px] tracking-widest uppercase hover:bg-primary hover:text-black">
                                    <FaSave className="mr-2" /> Commit
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

function MetaBlock({ label, color }: { label: string, color: string }) {
    return (
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="space-y-1">
                <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">{label}</p>
                <p className="text-[9px] font-black text-white font-mono">{color}</p>
            </div>
            <div className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: color }} />
        </div>
    )
}
