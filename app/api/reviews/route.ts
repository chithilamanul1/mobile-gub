
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { adminDb } from "@/lib/firebase-admin"
import { z } from "zod"

const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    images: z.array(z.string()).optional(), // Array of URL strings
    productId: z.string().optional(), // If product review
    type: z.enum(["PRODUCT", "SITE"]).default("PRODUCT")
})

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized. Please sign in.", { status: 401 })
        }

        const body = await req.json()
        const validated = reviewSchema.safeParse(body)

        if (!validated.success) {
            return new NextResponse(validated.error.errors[0]?.message || "Invalid input", { status: 400 })
        }

        const { rating, comment, images, productId, type } = validated.data

        const reviewData = {
            rating,
            comment,
            images: images || [],
            userId: session.user.id,
            productId: productId || null,
            type,
            isPublic: true,
            createdAt: new Date()
        }

        const docRef = await adminDb.collection("reviews").add(reviewData)

        return NextResponse.json({
            success: true,
            message: "Review submitted successfully",
            review: { id: docRef.id, ...reviewData }
        })

    } catch (error) {
        console.error("[REVIEW_SUBMIT]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    const type = searchParams.get('type') || "PRODUCT"

    try {
        let query = adminDb.collection("reviews")
            .where("isPublic", "==", true)
            .where("type", "==", type)

        if (productId) {
            query = query.where("productId", "==", productId)
        }

        const snapshot = await query.get()
        let reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]

        // Optimization: Helper function to batch fetch users
        const userIds = [...new Set(reviews.map(r => r.userId))]
        const usersRef = adminDb.collection("users")

        let usersMap = new Map()
        if (userIds.length > 0) {
            // Firestore 'in' query supports max 10 item. 
            // For simplicity in this migration, we fetch individually with Promise.all 
            // OR we can implement chunks. Promise.all is acceptable for low volume.
            const usersSnapshot = await Promise.all(userIds.map(uid => usersRef.doc(uid).get()))
            usersMap = new Map(usersSnapshot.map(snap => [snap.id, snap.data()]))
        }

        reviews = reviews.map(r => ({
            ...r,
            user: usersMap.get(r.userId) || { name: 'Anonymous', image: null },
            createdAt: r.createdAt.toDate ? r.createdAt.toDate().toISOString() : r.createdAt
        }))

        // Sort manually
        reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        return NextResponse.json(reviews)
    } catch (error) {
        console.error(error)
        return new NextResponse("Failed to fetch reviews", { status: 500 })
    }
}
