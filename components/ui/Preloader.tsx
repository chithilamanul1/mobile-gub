"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export const Preloader = () => {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2500) // 2.5s duration

        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                    <div className="flex flex-col items-center justify-center relative">
                        {/* Glowing Background Effect */}
                        <motion.div
                            className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1, transition: { duration: 1.5 } }}
                        />

                        {/* Logo Animation */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "backOut" }}
                            className="relative w-24 h-24 mb-6"
                        >
                            <img
                                src="/logo.png"
                                alt="Mobile Hub Logo"
                                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                            />
                        </motion.div>

                        {/* Text Animation */}
                        <div className="overflow-hidden flex items-center gap-1">
                            {["M", "O", "B", "I", "L", "E", "\u00A0", "H", "U", "B"].map((char, index) => (
                                <motion.span
                                    key={index}
                                    className="text-2xl font-black text-white tracking-widest uppercase italic"
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.5 + (index * 0.05),
                                        ease: "circOut"
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>

                        {/* Subtext */}
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "100%" }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mt-4 max-w-[200px]"
                        />
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="text-[8px] text-white/40 tracking-[0.5em] uppercase mt-2 font-bold"
                        >
                            Imagine the Difference
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
