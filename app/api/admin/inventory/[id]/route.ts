import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single IMEI
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const imei = await prisma.iMEI.findUnique({
            where: { id },
            include: {
                product: {
                    select: {
                        brand: true,
                        model_name: true,
                        price_lkr: true
                    }
                }
            }
        })

        if (!imei) {
            return NextResponse.json(
                { error: 'IMEI not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(imei)
    } catch (error) {
        console.error('IMEI GET error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch IMEI' },
            { status: 500 }
        )
    }
}

// PUT update IMEI status
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        const validStatuses = ['AVAILABLE', 'SOLD']
        if (body.status && !validStatuses.includes(body.status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be: AVAILABLE or SOLD' },
                { status: 400 }
            )
        }

        const imei = await prisma.iMEI.update({
            where: { id },
            data: {
                ...(body.status && { status: body.status }),
                ...(body.is_registered !== undefined && { is_registered: body.is_registered })
            },
            include: {
                product: true
            }
        })

        // Update product stock count if status changed
        if (body.status) {
            const availableCount = await prisma.iMEI.count({
                where: {
                    productId: imei.productId,
                    status: 'AVAILABLE'
                }
            })

            await prisma.product.update({
                where: { id: imei.productId },
                data: { stock_count: availableCount }
            })
        }

        return NextResponse.json(imei)
    } catch (error: any) {
        console.error('IMEI PUT error:', error)

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'IMEI not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to update IMEI' },
            { status: 500 }
        )
    }
}

// DELETE IMEI (only if not sold)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const imei = await prisma.iMEI.findUnique({
            where: { id }
        })

        if (!imei) {
            return NextResponse.json(
                { error: 'IMEI not found' },
                { status: 404 }
            )
        }

        if (imei.status === 'SOLD') {
            return NextResponse.json(
                { error: 'Cannot delete sold IMEI. This is part of sales history.' },
                { status: 400 }
            )
        }

        // Delete IMEI and decrement stock
        await prisma.$transaction([
            prisma.iMEI.delete({
                where: { id }
            }),
            prisma.product.update({
                where: { id: imei.productId },
                data: { stock_count: { decrement: 1 } }
            })
        ])

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('IMEI DELETE error:', error)

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'IMEI not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to delete IMEI' },
            { status: 500 }
        )
    }
}
