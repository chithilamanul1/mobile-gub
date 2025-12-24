import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user || (session.user as any).role === "USER") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { products } = await req.json()
        let count = 0

        for (const p of products) {
            // Upsert: Update if SKU exists, Create if not
            // Since SKU is unique, we can use it to identify products
            if (!p.sku) continue

            await prisma.product.upsert({
                where: { sku: p.sku },
                update: {
                    price_lkr: p.price_lkr,
                    stock_count: p.stock_count,
                    // Typically we don't update name/desc on sync to avoid overwriting manual edits
                    // unless it's a forced full sync. For now, we sync core details.
                },
                create: {
                    sku: p.sku,
                    model_name: p.model_name,
                    brand: p.brand,
                    category: p.category,
                    price_lkr: p.price_lkr,
                    stock_count: p.stock_count,
                    description: p.description,
                    // POS doesn't provide images, so they will be null initially
                }
            })
            count++
        }

        return NextResponse.json({ success: true, count })

    } catch (error) {
        console.error("IMPORT_ERROR", error)
        return new NextResponse("Import Failed", { status: 500 })
    }
}
