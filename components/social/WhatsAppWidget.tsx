"use client"

import { FaWhatsapp } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function WhatsAppWidget() {
    const [isVisible, setIsVisible] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const pathname = usePathname()

    if (pathname?.startsWith("/admin")) return null

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 2000) // Delay appearance
        return () => clearTimeout(timer)
    }, [])

    const getMessage = () => {
        if (pathname.includes("/shop/")) return "Hi, I'm interested in this device. Is it available?"
        if (pathname.includes("/trade-in")) return "Hi, I'd like a quote for my old device."
        return "Hi Mobile Hub, I need some assistance."
    }

    const whatsappLink = `https://wa.me/94768825485?text=${encodeURIComponent(getMessage())}`

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                    {/* Tooltip */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-white text-black px-4 py-2 rounded-xl shadow-xl border border-gray-100 mb-2 mr-2 max-w-[200px]"
                            >
                                <p className="text-xs font-bold">Luxury Concierge Online 🟢</p>
                                <p className="text-[10px] text-gray-500">Typical reply: &lt; 5 mins</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Button */}
                    <motion.a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/30 cursor-pointer relative group"
                    >
                        <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-20" />
                        <FaWhatsapp className="w-8 h-8" />
                    </motion.a>
                </div>
            )}
        </AnimatePresence>
    )
}
