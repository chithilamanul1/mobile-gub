import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single product
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                imeis: {
                    select: {
                        id: true,
                        number: true,
                        status: true,
                        is_registered: true
                    }
                }
            }
        })

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(product)
    } catch (error) {
        console.error('Product GET error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        )
    }
}

// PUT update product
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        // Validation
        if (body.price_lkr !== undefined && body.price_lkr < 0) {
            return NextResponse.json(
                { error: 'Price cannot be negative' },
                { status: 400 }
            )
        }

        if (body.stock_count !== undefined && body.stock_count < 0) {
            return NextResponse.json(
                { error: 'Stock count cannot be negative' },
                { status: 400 }
            )
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...(body.brand && { brand: body.brand }),
                ...(body.model_name && { model_name: body.model_name }),
                ...(body.price_lkr !== undefined && { price_lkr: body.price_lkr }),
                ...(body.stock_count !== undefined && { stock_count: body.stock_count }),
                ...(body.is_trcsl_approved !== undefined && { is_trcsl_approved: body.is_trcsl_approved }),
                ...(body.category && { category: body.category })
            }
        })

        return NextResponse.json(product)
    } catch (error: any) {
        console.error('Product PUT error:', error)

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        )
    }
}

// DELETE product
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        // Check if product has IMEIs or sold devices
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        imeis: true,
                        sold_devices: true
                    }
                }
            }
        })

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        if (product._count.imeis > 0 || product._count.sold_devices > 0) {
            return NextResponse.json(
                { error: 'Cannot delete product with inventory or sales history' },
                { status: 400 }
            )
        }

        await prisma.product.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Product DELETE error:', error)

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        )
    }
}
