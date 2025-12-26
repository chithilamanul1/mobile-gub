
"use client"

import { useEffect, useState } from "react"
import { Star, User } from "lucide-react"

interface Review {
    id: string
    rating: number
    comment: string | null
    images: string[]
    user: {
        name: string | null
        image: string | null
    }
    createdAt: string
}

export function ReviewList({ productId }: { productId?: string }) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    const fetchReviews = async () => {
        try {
            const url = productId
                ? `/api/reviews?productId=${productId}`
                : `/api/reviews?type=SITE`

            const res = await fetch(url)
            if (res.ok) {
                const data = await res.json()
                setReviews(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [productId])

    // Expose refresh function to parent via custom event or context if needed, 
    // but for now we'll just re-fetch if this component re-mounts or we can add a listener.
    // A simpler way for the Form to trigger this is to pass a "refresh" prop or trigger.
    // We will stick to simple independent fetch for now and assume page refresh or parent coordination.

    if (loading) return <div className="text-xs text-gray-400 uppercase animate-pulse">Loading reviews...</div>

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                <p className="text-gray-400 text-sm font-medium">No reviews yet. Be the first!</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 dark:border-white/5 pb-8 last:border-0">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {review.user.image ? (
                                <img src={review.user.image} alt={review.user.name || "User"} className="w-8 h-8 rounded-full" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User className="w-4 h-4 text-primary" />
                                </div>
                            )}
                            <div>
                                <p className="text-xs font-bold uppercase">{review.user.name || "Anonymous"}</p>
                                <p className="text-[10px] text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < review.rating ? "fill-primary text-primary" : "text-gray-200 dark:text-white/10"}`}
                                />
                            ))}
                        </div>
                    </div>

                    {review.comment && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            {review.comment}
                        </p>
                    )}

                    {review.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto py-2">
                            {review.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt="Review attachment"
                                    className="h-20 w-auto rounded-lg border border-gray-100 dark:border-white/10"
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
