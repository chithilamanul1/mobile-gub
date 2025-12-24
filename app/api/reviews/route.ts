import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { rating, comment, productId, type } = body

        if (!rating || !comment) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                productId,
                type: type || "PRODUCT",
                userId: (session.user as any).id
            }
        })

        return NextResponse.json(review)

    } catch (error) {
        console.error("REVIEW_POST_ERROR", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")

    if (!productId) {
        return new NextResponse("Product ID required", { status: 400 })
    }

    try {
        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(reviews)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
