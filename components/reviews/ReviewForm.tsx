
"use client"

import { useState } from "react"
import { Star, Image as ImageIcon, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ReviewFormProps {
    productId: string
    onReviewSubmitted?: () => void
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [images, setImages] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        try {
            for (const file of Array.from(files)) {
                if (images.length >= 3) break // Limit to 3 images

                const formData = new FormData()
                formData.append("file", file)

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                })

                if (!res.ok) throw new Error("Upload failed")

                const data = await res.json()
                setImages(prev => [...prev, data.url])
            }
        } catch (error) {
            toast.error("Failed to upload image")
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating")
            return
        }
        if (!comment.trim()) {
            toast.error("Please write a comment")
            return
        }

        setSubmitting(true)

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rating,
                    comment,
                    images,
                    productId,
                    type: "PRODUCT"
                })
            })

            if (!res.ok) {
                const text = await res.text()
                if (res.status === 401) {
                    toast.error("Please sign in to leave a review")
                    return
                }
                throw new Error(text)
            }

            toast.success("Review submitted!")
            setRating(0)
            setComment("")
            setImages([])
            onReviewSubmitted?.()

        } catch (error) {
            toast.error("Failed to submit review")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-6 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Write a Review</h3>

            {/* Star Rating */}
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                    >
                        <Star
                            className={`w-6 h-6 ${(hoverRating || rating) >= star
                                    ? "fill-primary text-primary"
                                    : "text-gray-300 dark:text-white/20"
                                }`}
                        />
                    </button>
                ))}
            </div>

            {/* Comment */}
            <Textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-white dark:bg-black/50 border-gray-200 dark:border-white/10 min-h-[100px]"
            />

            {/* Image Upload */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploading || images.length >= 3}
                        onClick={() => document.getElementById("review-image-upload")?.click()}
                        className="text-xs uppercase font-bold"
                    >
                        {uploading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <ImageIcon className="w-4 h-4 mr-2" />
                        )}
                        Add Photos ({images.length}/3)
                    </Button>
                    <input
                        id="review-image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </div>

                {images.length > 0 && (
                    <div className="flex gap-2 bg-black/5 p-2 rounded-lg">
                        {images.map((url, idx) => (
                            <div key={idx} className="relative w-16 h-16 rounded-md overflow-hidden group">
                                <img src={url} alt="Review" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Button
                onClick={handleSubmit}
                disabled={submitting || uploading}
                className="w-full font-black uppercase tracking-widest"
            >
                {submitting ? "Submitting..." : "Post Review"}
            </Button>
        </div>
    )
}
