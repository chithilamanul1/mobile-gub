"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Facebook, ExternalLink, Camera, Loader2 } from "lucide-react"

interface SocialPost {
    id: string
    message: string
    full_picture: string
    created_time: string
    permalink_url: string
}

export function FacebookFeed() {
    const [posts, setPosts] = useState<SocialPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await fetch("/api/social/facebook")
                if (res.ok) {
                    const data = await res.json()
                    setPosts(data)
                }
            } catch (error) {
                console.error("SOCIAL_FETCH_ERROR", error)
            } finally {
                setLoading(false)
            }
        }
        fetchFeed()
    }, [])

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Synchronizing Social Registry...</p>
        </div>
    )

    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-6">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="w-8 h-[2px] bg-primary" />
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase">SOCIAL AUTHORITY</span>
                        </div>
                        <h2 className="text-5xl font-black tracking-tight uppercase leading-none">The Institutional Community</h2>
                        <p className="text-gray-400 dark:text-white/30 text-xs font-bold uppercase tracking-widest max-w-xl">
                            Live synchronization with our Facebook community. Captured moments with our satisfied flagship owners.
                        </p>
                    </div>

                    <a
                        href="https://web.facebook.com/KaushikaRandima"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 p-4 bg-blue-600/10 text-blue-600 rounded-2xl border border-blue-600/20 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all group"
                    >
                        <Facebook className="w-4 h-4" /> VISIT OUR FACEBOOK <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                    </a>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, idx) => (
                        <motion.a
                            key={post.id}
                            href={post.permalink_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative h-[450px] rounded-[40px] overflow-hidden bg-surface border border-white/5"
                        >
                            <img
                                src={post.full_picture}
                                alt="Happy Customer"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            <div className="absolute bottom-0 left-0 r-0 p-8 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">LATEST UPDATE</span>
                                </div>
                                <p className="text-sm font-medium text-white/90 leading-relaxed line-clamp-3 italic">
                                    "{post.message || 'Another success story at Mobile Hub.'}"
                                </p>
                                <div className="pt-4 flex items-center justify-between">
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
                                        {new Date(post.created_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <Camera className="text-primary w-5 h-5 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0" />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>

            </div>
        </section>
    )
}
