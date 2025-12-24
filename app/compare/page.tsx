"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Check, X, Plus } from "lucide-react"

// Mock Data for Phase 1 - In real app, this would fetch from API
const PRODUCTS = [
    {
        id: "iphone-16-pro-max",
        name: "iPhone 16 Pro Max",
        image: "/products/iphone_white_v2.png",
        price: "420,000",
        specs: {
            display: "6.9\" Super Retina XDR",
            chip: "A18 Pro",
            camera: "48MP Fusion / 5x Telephoto",
            battery: "4676 mAh",
            material: "Titanium Grade 5"
        }
    },
    {
        id: "samsung-s24-ultra",
        name: "Galaxy S24 Ultra",
        image: "/products/preowned_androids.png", // Placeholder
        price: "385,000",
        specs: {
            display: "6.8\" Dynamic AMOLED 2X",
            chip: "Snapdragon 8 Gen 3",
            camera: "200MP Wide / 10x Telephoto",
            battery: "5000 mAh",
            material: "Titanium"
        }
    },
    {
        id: "iphone-15-pro",
        name: "iPhone 15 Pro",
        image: "/products/preowned_iphones.png", // Placeholder
        price: "310,000",
        specs: {
            display: "6.1\" Super Retina XDR",
            chip: "A17 Pro",
            camera: "48MP Main / 3x Telephoto",
            battery: "3274 mAh",
            material: "Titanium Grade 5"
        }
    }
]

export default function ComparePage() {
    const [selected, setSelected] = useState<string[]>(["iphone-16-pro-max", "samsung-s24-ultra"])

    const toggleProduct = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(p => p !== id))
        } else {
            if (selected.length < 3) {
                setSelected([...selected, id])
            }
        }
    }

    const selectedProducts = PRODUCTS.filter(p => selected.includes(p.id))

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="text-primary font-black tracking-widest text-[10px] uppercase">Flagship Battle</span>
                    <h1 className="text-5xl font-black tracking-tight uppercase">Compare & Decide</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">Select up to 3 devices to see a side-by-side specification breakdown.</p>
                </div>

                {/* Selector Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                    {PRODUCTS.map(product => (
                        <div
                            key={product.id}
                            onClick={() => toggleProduct(product.id)}
                            className={`
                                cursor-pointer rounded-2xl border p-4 transition-all
                                ${selected.includes(product.id)
                                    ? "bg-white/10 border-primary"
                                    : "bg-white/5 border-transparent hover:bg-white/10"}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 bg-black rounded-lg p-2">
                                    <Image src={product.image} alt={product.name} fill className="object-contain" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase">{product.name}</p>
                                    <p className="text-[10px] text-gray-400">LKR {product.price}</p>
                                </div>
                                <div className="ml-auto">
                                    {selected.includes(product.id) ? <Check className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-gray-500" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                    <div className="min-w-[800px] grid grid-cols-4 gap-8">

                        {/* Labels Column */}
                        <div className="col-span-1 space-y-8 pt-64">
                            <LabelRow label="Display" />
                            <LabelRow label="Processor" />
                            <LabelRow label="Camera System" />
                            <LabelRow label="Battery" />
                            <LabelRow label="Build Material" />
                            <LabelRow label="Current Price" />
                        </div>

                        {/* Product Columns */}
                        <AnimatePresence>
                            {selectedProducts.map(product => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="col-span-1 space-y-8 text-center"
                                >
                                    {/* Product Header */}
                                    <div className="h-56 flex flex-col items-center justify-end pb-8 gap-4 border-b border-white/10">
                                        <div className="relative w-32 h-32">
                                            <Image src={product.image} alt={product.name} fill className="object-contain" />
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">{product.name}</h3>
                                        <Button className="w-full bg-white text-black hover:bg-primary font-bold uppercase text-[10px] tracking-widest h-10">
                                            Buy Now
                                        </Button>
                                    </div>

                                    {/* Specs */}
                                    <SpecRow value={product.specs.display} />
                                    <SpecRow value={product.specs.chip} />
                                    <SpecRow value={product.specs.camera} />
                                    <SpecRow value={product.specs.battery} />
                                    <SpecRow value={product.specs.material} />
                                    <div className="py-4 border-b border-white/10 min-h-[64px] flex items-center justify-center">
                                        <p className="text-xl font-black text-primary">LKR {product.price}</p>
                                    </div>

                                </motion.div>
                            ))}
                            {/* Empty Placeholders to fill grid if < 3 selected */}
                            {Array.from({ length: 3 - selected.length }).map((_, i) => (
                                <div key={i} className="col-span-1 border-l border-white/5 opacity-20 flex items-center justify-center">
                                    <p className="text-xs uppercase tracking-widest -rotate-90">Select Product</p>
                                </div>
                            ))}
                        </AnimatePresence>

                    </div>
                </div>

            </div>
        </div>
    )
}

function LabelRow({ label }: { label: string }) {
    return (
        <div className="py-4 border-b border-white/5 min-h-[64px] flex items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</span>
        </div>
    )
}

function SpecRow({ value }: { value: string }) {
    return (
        <div className="py-4 border-b border-white/10 min-h-[64px] flex items-center justify-center">
            <span className="text-sm font-medium">{value}</span>
        </div>
    )
}
