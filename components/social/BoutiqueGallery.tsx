"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Image as ImageIcon } from "lucide-react"

export function BoutiqueGallery() {
    const [albums, setAlbums] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const res = await fetch('/api/social/albums')
                const data = await res.json()
                setAlbums(data)
            } catch (error) {
                console.error("GALLERY_SYNC_ERROR", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAlbums()
    }, [])

    if (loading) return null

    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b border-white/5 pb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="w-8 h-[2px] bg-primary" />
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase">VISUAL ARCHIVES</span>
                        </div>
                        <h2 className="text-5xl font-black tracking-tight uppercase leading-none italic text-white">
                            The Media Vault
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {albums.map((album) => (
                        <Card key={album.id} className="group bg-[#080808] border-white/5 overflow-hidden rounded-[32px] hover:border-primary/30 transition-all cursor-pointer">
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <img
                                    src={album.cover_photo}
                                    alt={album.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-all" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-xl font-black uppercase italic text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform">{album.name}</h3>
                                    <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 delay-75">
                                        <ImageIcon className="w-4 h-4" />
                                        <span className="text-[10px] font-black tracking-widest uppercase">{album.count} SNAPSHOTS</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
