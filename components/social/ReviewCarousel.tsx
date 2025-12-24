"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa"

interface Review {
    id: string
    reviewer_name: string
    rating: number
    review_text: string
    created_time: string
    reviewer_image: string
}

export function ReviewCarousel() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch("/api/social/reviews")
                if (res.ok) {
                    const data = await res.json()
                    setReviews(data)
                }
            } catch (error) {
                console.error("REVIEWS_UI_ERROR", error)
            } finally {
                setLoading(false)
            }
        }
        fetchReviews()
    }, [])

    const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length)
    const prev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)

    if (loading || reviews.length === 0) return null

    return (
        <section className="py-24 bg-surface overflow-hidden">
            <div className="container mx-auto px-6">

                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="w-8 h-[2px] bg-primary" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase">INSTITUTIONAL TRUST</span>
                        <div className="w-8 h-[2px] bg-primary" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic">The Voice of the Community</h2>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-background p-12 md:p-20 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden"
                        >
                            <FaQuoteLeft className="absolute top-12 left-12 text-primary opacity-10 text-6xl" />

                            <div className="flex flex-col items-center space-y-8 relative z-10">
                                <div className="flex gap-1 text-primary">
                                    {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                                        <FaStar key={i} className="text-xl" />
                                    ))}
                                </div>

                                <p className="text-lg md:text-2xl font-medium text-gray-700 dark:text-white/80 leading-relaxed italic">
                                    "{reviews[currentIndex].review_text}"
                                </p>

                                <div className="flex items-center gap-4 pt-6">
                                    <img
                                        src={reviews[currentIndex].reviewer_image}
                                        alt={reviews[currentIndex].reviewer_name}
                                        className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20"
                                    />
                                    <div className="text-left">
                                        <p className="font-black uppercase tracking-widest text-sm">{reviews[currentIndex].reviewer_name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-white/20 uppercase tracking-[0.2em]">Verified Hub Owner</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-center gap-4 mt-12">
                        <button
                            onClick={prev}
                            className="p-4 bg-surface rounded-2xl border border-white/10 hover:bg-primary hover:text-black transition-all group"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={next}
                            className="p-4 bg-surface rounded-2xl border border-white/10 hover:bg-primary hover:text-black transition-all group"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    )
}
