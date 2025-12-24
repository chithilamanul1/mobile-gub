import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const POS_SECRET_KEY = process.env.POS_SECRET_KEY || "KR_MOBILE_POS_SECRET_2025"

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization')
        if (authHeader !== `Bearer ${POS_SECRET_KEY}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { imei, action, modelName, price, brand } = body

        if (!action) {
            return NextResponse.json({ error: 'Missing action' }, { status: 400 })
        }

        if (action === "SOLD") {
            if (!imei) return NextResponse.json({ error: 'Missing IMEI' }, { status: 400 })

            // 1. Find the product via IMEI first, or fallback to model name
            // Ideally POS sends Product ID, but we assume Model Name sync for now
            let product = await prisma.product.findFirst({
                where: {
                    OR: [
                        { model_name: modelName },
                        { imeis: { some: { number: imei } } }
                    ]
                }
            })

            if (product) {
                // Transaction to ensure data integrity
                await prisma.$transaction(async (tx: any) => {
                    // Decrement Stock
                    await tx.product.update({
                        where: { id: product.id },
                        data: { stock_count: { decrement: 1 } }
                    })

                    // Mark IMEI as Sold (if it exists in IMEI table)
                    const existingImei = await tx.iMEI.findUnique({ where: { number: imei } })
                    if (existingImei) {
                        await tx.iMEI.update({
                            where: { id: existingImei.id },
                            data: { status: "SOLD" }
                        })
                    }

                    // Record Sale
                    await tx.soldDevice.create({
                        data: {
                            imei: imei,
                            productId: product.id
                        }
                    })
                })

                return NextResponse.json({ success: true, message: "Sale recorded and stock updated" })
            } else {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 })
            }

        } else if (action === "RESTOCK") {
            if (!modelName || !price) return NextResponse.json({ error: 'Missing restock details' }, { status: 400 })

            // Find or Create Product
            let product = await prisma.product.findFirst({ where: { model_name: modelName } })

            if (!product) {
                product = await prisma.product.create({
                    data: {
                        model_name: modelName,
                        brand: brand || "Unknown",
                        price_lkr: price,
                        stock_count: 1,
                        is_trcsl_approved: true
                    }
                })
            } else {
                await prisma.product.update({
                    where: { id: product.id },
                    data: { stock_count: { increment: 1 } }
                })
            }

            // Add IMEI if provided
            if (imei) {
                await prisma.iMEI.create({
                    data: {
                        number: imei,
                        productId: product.id,
                        is_registered: true
                    }
                })
            }

            return NextResponse.json({ success: true, message: "Restock successful" })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

    } catch (error) {
        console.error("POS Sync Error:", error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
