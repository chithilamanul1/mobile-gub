"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface VisualVariantSelectorProps {
    stock: number
}

// Mock data for demonstration - in a real app this would come from the DB
const COLORS = [
    { name: "Titanium Black", hex: "#1e1e1e", available: true },
    { name: "Titanium White", hex: "#f0f0f0", available: true },
    { name: "Titanium Blue", hex: "#2f3b52", available: true },
    { name: "Natural Titanium", hex: "#b5b0a3", available: false }, // Out of stock example
]

const STORAGE = [
    { capacity: "128GB", price_adjust: 0 },
    { capacity: "256GB", price_adjust: 20000 },
    { capacity: "512GB", price_adjust: 55000 },
    { capacity: "1TB", price_adjust: 120000 },
]

export function VisualVariantSelector({ stock }: VisualVariantSelectorProps) {
    const [selectedColor, setSelectedColor] = useState(COLORS[0])
    const [selectedStorage, setSelectedStorage] = useState(STORAGE[1])

    return (
        <div className="space-y-8">
            {/* Color Selection */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-widest uppercase text-gray-500">
                        Select Finish
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {selectedColor.name}
                    </span>
                </div>
                <div className="flex flex-wrap gap-4">
                    {COLORS.map((color) => (
                        <div key={color.name} className="relative group">
                            <button
                                onClick={() => color.available && setSelectedColor(color)}
                                disabled={!color.available}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative",
                                    !color.available && "opacity-20 cursor-not-allowed",
                                    selectedColor.name === color.name ?
                                        "ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-black scale-110" :
                                        "hover:scale-105"
                                )}
                            >
                                <span
                                    className="w-full h-full rounded-full border border-black/10 dark:border-white/10 shadow-inner"
                                    style={{ backgroundColor: color.hex }}
                                />
                                {!color.available && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-[1px] bg-red-500 rotate-45" />
                                    </div>
                                )}
                            </button>

                            {/* Tooltip */}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                <span className="text-[10px] bg-black text-white px-2 py-1 rounded">
                                    {color.available ? color.name : "Sold Out"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Storage Selection */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-widest uppercase text-gray-500">
                        Storage Capacity
                    </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {STORAGE.map((option) => (
                        <button
                            key={option.capacity}
                            onClick={() => setSelectedStorage(option)}
                            className={cn(
                                "flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-200",
                                selectedStorage.capacity === option.capacity ?
                                    "bg-white dark:bg-white text-black border-primary shadow-lg ring-1 ring-primary" :
                                    "bg-transparent border-gray-200 dark:border-white/10 text-gray-500 hover:border-primary/50 hover:bg-white/5"
                            )}
                        >
                            <span className="text-xs font-black tracking-wider">{option.capacity}</span>
                            {option.price_adjust > 0 && (
                                <span className="text-[10px] font-medium opacity-60">+{option.price_adjust / 1000}k</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stock Urgency Indicator */}
            <StockUrgencyIndicator stock={stock} />
        </div>
    )
}

function StockUrgencyIndicator({ stock }: { stock: number }) {
    if (stock <= 0) {
        return (
            <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-4 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div>
                    <p className="text-xs font-bold text-red-500 uppercase">Currently Out of Stock</p>
                    <p className="text-[10px] text-gray-500">We'll notify you when it's back.</p>
                </div>
            </div>
        )
    }

    if (stock < 5) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-4"
            >
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <div>
                    <p className="text-sm font-black text-amber-500 uppercase tracking-wide">
                        Only {stock} Units Left
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                        High Demand - Selling Fast
                    </p>
                </div>
            </motion.div>
        )
    }

    return null
}
