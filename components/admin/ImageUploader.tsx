"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CloudUpload, Trash2, Image as ImageIcon, Star, X } from "lucide-react"

interface ImageUploaderProps {
    productId: string
    currentImage?: string
    onUploadSuccess?: () => void
}

export function ImageUploader({ productId, currentImage, onUploadSuccess }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<any[]>([])
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Fetch existing images
    const fetchImages = async () => {
        try {
            const res = await fetch(`/api/admin/products/${productId}/images`)
            if (res.ok) {
                const data = await res.json()
                setImages(data)
            }
        } catch (error) {
            console.error("Failed to load images")
        }
    }

    useEffect(() => {
        if (productId) fetchImages()
    }, [productId])

    const handleFileSelect = async (files: FileList) => {
        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'))

        if (validFiles.length === 0) return

        setUploading(true)
        try {
            // Upload each file
            for (const file of validFiles) {
                if (file.size > 5 * 1024 * 1024) continue // Skip large files

                const formData = new FormData()
                formData.append('file', file)
                formData.append('folder', 'mobile-hub-products')

                // 1. Upload to storage (Cloudinary/Local)
                const uploadRes = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData
                })

                if (!uploadRes.ok) throw new Error("Upload failed")
                const uploadData = await uploadRes.json()

                // 2. Link to product in DB
                await fetch(`/api/admin/products/${productId}/images`, {
                    method: 'POST',
                    body: JSON.stringify({
                        url: uploadData.secure_url || uploadData.url,
                        isMain: images.length === 0 // First image is main
                    }),
                    headers: { 'Content-Type': 'application/json' }
                })
            }

            await fetchImages()
            onUploadSuccess?.()
        } catch (error) {
            alert('Upload failed. Please check your connection.')
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (imageId: string) => {
        if (!confirm("Remove this asset?")) return
        try {
            const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
                method: 'DELETE'
            })
            if (res.ok) fetchImages()
        } catch (e) {
            console.error("Delete failed")
        }
    }

    const handleSetMain = async (imageUrl: string) => {
        try {
            await fetch(`/api/admin/products/${productId}`, {
                method: 'PUT',
                body: JSON.stringify({ image_url: imageUrl }),
                headers: { 'Content-Type': 'application/json' }
            })
            onUploadSuccess?.() // Refresh parent
            fetchImages()
        } catch (e) {
            console.error("Set main failed")
        }
    }

    return (
        <div className="space-y-6">
            <div
                onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files) handleFileSelect(e.dataTransfer.files);
                }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={`
                    relative border-2 border-dashed rounded-[32px] p-8 transition-all duration-300
                    flex flex-col items-center justify-center gap-4 cursor-pointer
                    ${dragOver ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}
                `}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <CloudUpload className={`w-8 h-8 ${uploading ? 'animate-bounce text-primary' : 'text-white/40'}`} />
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                        {uploading ? 'UPLOADING ASSETS...' : 'DROP ASSETS HERE'}
                    </p>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-2">
                        MAX 5MB • JPG PNG WEBP
                    </p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                    className="hidden"
                />
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 gap-4">
                {currentImage && (
                    <div className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-primary">
                        <img src={currentImage} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-primary text-black text-[8px] font-black uppercase px-2 py-1 rounded-full">
                            MAIN ASSET
                        </div>
                    </div>
                )}
                {images.filter(img => img.url !== currentImage).map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/10 bg-white/5">
                        <img src={img.url} className="w-full h-full object-cover" />

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-white hover:text-primary h-8 w-8 p-0"
                                onClick={() => handleSetMain(img.url)}
                                title="Set as Main"
                            >
                                <Star className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-white hover:text-red-500 h-8 w-8 p-0"
                                onClick={() => handleDelete(img.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
