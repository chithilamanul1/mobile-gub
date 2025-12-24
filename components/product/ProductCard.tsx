"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FaShoppingCart, FaEye, FaShieldAlt } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"

interface ProductCardProps {
    id: string
    brand: string
    modelName: string
    price: number
    stock: number
    image?: string
    isTrcslApproved?: boolean
}

export function ProductCard({ id, brand, modelName, price, stock, image, isTrcslApproved }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
        >
            <Link href={`/shop/${id}`} className="relative block aspect-[4/5] bg-gray-50 dark:bg-[#050505] overflow-hidden p-6">
                {image ? (
                    <Image
                        src={image}
                        alt={modelName}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-white/5">
                        <span className="text-gray-300 dark:text-white/10 text-6xl uppercase font-black italic">HUB</span>
                    </div>
                )}

                {/* Condition/Badge (Simplified) */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isTrcslApproved && (
                        <div className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <FaShieldAlt className="w-2 h-2" /> TRCSL
                        </div>
                    )}
                    {stock > 0 && stock < 5 && (
                        <div className="bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg">
                            LOW STOCK
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary tracking-widest uppercase">{brand}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {modelName}
                    </h3>
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                            LKR {price.toLocaleString()}
                        </p>
                        <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter ${stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                    </div>
                </div>

                <div className="pt-4 flex gap-2">
                    <Link href={`/shop/${id}`} className="flex-1">
                        <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary font-bold text-xs h-12 rounded-xl transition-all uppercase tracking-widest">
                            VIEW DETAILS
                        </Button>
                    </Link>
                    <Button variant="outline" className="w-12 h-12 p-0 rounded-xl border-gray-200 dark:border-white/10 hover:border-primary transition-colors">
                        <FaShoppingCart className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
