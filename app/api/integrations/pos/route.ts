import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Public Webhook for POS System to sync data
// Should be secured with a secret key in production
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { event, product } = body

        // Validate basic payload
        if (!product || !product.sku) {
            return new NextResponse("Invalid Payload", { status: 400 })
        }

        // Handle "Product Created" or "Product Updated" events
        if (event === "product.updated" || event === "product.created") {
            const price = typeof product.price === 'string'
                ? parseFloat(product.price.replace(/[^0-9.]/g, ''))
                : product.price

            const stock = typeof product.stock === 'string'
                ? parseInt(product.stock.split(' ')[0])
                : product.stock

            await prisma.product.upsert({
                where: { sku: product.sku },
                update: {
                    price_lkr: price,
                    stock_count: stock,
                    // If Axeno sends a direct update, we might want to update the name too
                    // model_name: product.name 
                },
                create: {
                    sku: product.sku,
                    model_name: product.name || "Synced Product",
                    brand: product.brand || "Generic",
                    price_lkr: price,
                    stock_count: stock,
                    category: product.category || "General",
                    description: "Synced from Axeno POS"
                }
            })

            console.log(`POS_SYNC: Updated SKU ${product.sku}`)
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("POS_WEBHOOK_ERROR", error)
        return new NextResponse("Sync Failed", { status: 500 })
    }
}
