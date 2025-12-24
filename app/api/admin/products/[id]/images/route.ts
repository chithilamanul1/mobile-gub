import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session?.user || (session.user as any).role === "USER") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await params
        const body = await req.json()
        const { url, isMain } = body

        // Create image record
        const image = await prisma.productImage.create({
            data: {
                productId: id,
                url,
            }
        })

        // If it's the main image, update the product
        if (isMain) {
            await prisma.product.update({
                where: { id },
                data: { image_url: url }
            })
        }

        return NextResponse.json(image)
    } catch (error) {
        console.error("[IMAGES_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const images = await prisma.productImage.findMany({
            where: { productId: id },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(images)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
