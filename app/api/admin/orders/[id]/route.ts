import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single order
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                brand: true,
                                model_name: true,
                                price_lkr: true
                            }
                        }
                    }
                }
            }
        })

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error('Order GET error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch order' },
            { status: 500 }
        )
    }
}

// PUT update order status
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        // Validate status
        const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']
        if (body.status && !validStatuses.includes(body.status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be: PENDING, PROCESSING, COMPLETED, or CANCELLED' },
                { status: 400 }
            )
        }

        const order = await prisma.order.update({
            where: { id },
            data: {
                ...(body.status && { status: body.status }),
                ...(body.total !== undefined && { total: body.total })
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        return NextResponse.json(order)
    } catch (error: any) {
        console.error('Order PUT error:', error)

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        )
    }
}

// DELETE order (with safety checks)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Check if order has sold items
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { items: true }
                }
            }
        })

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        if (order._count.items > 0) {
            return NextResponse.json(
                { error: 'Cannot delete order with items. Cancel it instead.' },
                { status: 400 }
            )
        }

        await prisma.order.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Order DELETE error:', error)

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to delete order' },
            { status: 500 }
        )
    }
}
