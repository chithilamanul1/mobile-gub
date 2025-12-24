import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET inventory with filters
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')
        const status = searchParams.get('status') || 'all'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '100')
        const skip = (page - 1) * limit

        let where: any = {}

        if (productId) {
            where.productId = productId
        }

        if (status !== 'all') {
            where.status = status
        }

        const [imeis, total, products] = await Promise.all([
            prisma.iMEI.findMany({
                where,
                include: {
                    product: {
                        select: {
                            brand: true,
                            model_name: true,
                            price_lkr: true
                        }
                    }
                },
                orderBy: { id: 'desc' },
                skip,
                take: limit
            }),
            prisma.iMEI.count({ where }),
            prisma.product.findMany({
                select: {
                    id: true,
                    brand: true,
                    model_name: true
                },
                orderBy: { brand: 'asc' }
            })
        ])

        return NextResponse.json({
            imeis,
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Inventory GET error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch inventory' },
            { status: 500 }
        )
    }
}

// POST add new IMEI
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validation
        if (!body.number || !body.productId) {
            return NextResponse.json(
                { error: 'IMEI number and product ID are required' },
                { status: 400 }
            )
        }

        // Validate IMEI format (15 digits)
        if (!/^\d{15}$/.test(body.number)) {
            return NextResponse.json(
                { error: 'IMEI must be exactly 15 digits' },
                { status: 400 }
            )
        }

        // Check if IMEI already exists
        const existing = await prisma.iMEI.findUnique({
            where: { number: body.number }
        })

        if (existing) {
            return NextResponse.json(
                { error: 'This IMEI already exists in the system' },
                { status: 400 }
            )
        }

        // Add IMEI and increment product stock
        const [imei] = await prisma.$transaction([
            prisma.iMEI.create({
                data: {
                    number: body.number,
                    productId: body.productId,
                    is_registered: body.is_registered ?? true,
                    status: 'AVAILABLE'
                },
                include: {
                    product: {
                        select: {
                            brand: true,
                            model_name: true
                        }
                    }
                }
            }),
            prisma.product.update({
                where: { id: body.productId },
                data: { stock_count: { increment: 1 } }
            })
        ])

        return NextResponse.json(imei, { status: 201 })
    } catch (error) {
        console.error('Inventory POST error:', error)
        return NextResponse.json(
            { error: 'Failed to add IMEI' },
            { status: 500 }
        )
    }
}
