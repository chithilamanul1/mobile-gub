"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa"

const SLIDES = [
    {
        id: 1,
        title: "IPHONE 16 PRO",
        subtitle: "TITANIUM. POWERFUL. ELITE.",
        description: "Experience the pinnacle of innovation with the new iPhone 16 Pro Max. Now available with official warranty.",
        image: "/banners/iphone_hero.png",
        color: "#d4af37",
        link: "/shop?brand=Apple"
    },
    {
        id: 2,
        title: "GALAXY S24 ULTRA",
        subtitle: "GALAXY AI IS HERE.",
        description: "Unleash new levels of creativity and productivity with the most powerful Galaxy yet.",
        image: "/banners/samsung_hero.png",
        color: "#3b82f6",
        link: "/shop?brand=Samsung"
    }
]

export function Hero() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % SLIDES.length)
        }, 8000)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="relative h-[90vh] w-full overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    {/* Background Image with Ken Burns effect */}
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${SLIDES[current].image})` }}
                    />

                    {/* Luxury Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10" />

                    {/* Content */}
                    <div className="container relative z-20 h-full flex items-center px-4 md:px-12">
                        <div className="max-w-4xl space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                <span
                                    className="inline-block text-xs font-black tracking-[0.5em] uppercase mb-4 px-3 py-1 border border-white/20 backdrop-blur-md rounded-full bg-white/5"
                                    style={{ color: SLIDES[current].color }}
                                >
                                    {SLIDES[current].subtitle}
                                </span>
                                <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter uppercase mb-6 drop-shadow-2xl">
                                    {SLIDES[current].title.split(' ').map((word, i) => (
                                        <span key={i} className="block">{word}</span>
                                    ))}
                                </h1>
                                <p className="text-xl text-white/60 max-w-xl font-light leading-relaxed mb-10 border-l-2 border-white/10 pl-6">
                                    {SLIDES[current].description}
                                </p>
                                <div className="flex flex-wrap gap-6">
                                    <Link href={SLIDES[current].link}>
                                        <Button size="lg" className="bg-white text-black hover:bg-primary hover:text-black font-black px-12 h-16 rounded-none transition-all duration-500 group uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                            EXPLORE NOW <FaChevronRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                                        </Button>
                                    </Link>
                                    <Link href="/repairs">
                                        <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 hover:border-white rounded-none px-12 h-16 font-bold uppercase tracking-widest text-sm backdrop-blur-sm">
                                            SERVICES
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute bottom-12 left-12 z-30 flex gap-4">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1 transition-all duration-500 ${current === i ? 'w-16 bg-primary' : 'w-8 bg-white/20'}`}
                    />
                ))}
            </div>

            <div className="absolute bottom-12 right-12 z-30 flex gap-4">
                <button
                    onClick={() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                >
                    <FaChevronLeft />
                </button>
                <button
                    onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                >
                    <FaChevronRight />
                </button>
            </div>

            {/* Side Decorative Text */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-90 z-20 hidden lg:block opacity-10 pointer-events-none">
                <span className="text-[120px] font-black tracking-[0.5em] text-white uppercase whitespace-nowrap">
                    MOBILE HUB EXCLUSIVE
                </span>
            </div>
        </section>
    )
}
