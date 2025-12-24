"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

export function VideoHero() {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    })

    // Parallax effects
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <div ref={ref} className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center bg-black">
            {/* Video Background (Simulated with image for now, but structure ready for video) */}
            <motion.div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(/hero-bg.png)', // Using the generated asset
                    y: backgroundY
                }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            </motion.div>

            {/* Content */}
            <motion.div
                className="relative z-10 text-center px-4 max-w-5xl space-y-8"
                style={{ y: textY, opacity }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Badge className="bg-white/10 text-white backdrop-blur-md border-white/20 mb-6 px-4 py-1.5 text-sm rounded-full font-light tracking-wide uppercase">
                        <MapPin className="w-3 h-3 mr-2 text-primary" /> Seeduwa's Premier Mobile Hub
                    </Badge>
                </motion.div>

                <motion.h1
                    className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    BEYOND <span className="text-primary transparent-text-stroke">LIMITS</span>
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Discover the future of mobile technology. <br className="hidden md:block" />
                    Authorized Apple, Samsung, and Xiaomi Retailer.
                </motion.p>

                <motion.div
                    className="flex flex-col md:flex-row gap-6 justify-center items-center pt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Button size="lg" className="rounded-full px-10 h-16 bg-primary text-black font-bold hover:bg-primary/90 text-lg shadow-[0_0_30px_rgba(252,211,77,0.4)] transition-transform hover:scale-105">
                        Shop Collection
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full px-10 h-16 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm text-lg transition-transform hover:scale-105">
                        Visit Showroom
                    </Button>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
            </motion.div>
        </div>
    )
}
