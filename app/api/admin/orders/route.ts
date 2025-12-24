import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all orders with filters
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') || 'all'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '50')
        const skip = (page - 1) * limit

        const where = status !== 'all' ? { status } : {}

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
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
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.order.count({ where })
        ])

        return NextResponse.json({
            orders: orders.map((order: any) => ({
                ...order,
                itemCount: order.items.length
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Orders GET error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}

// POST create new order (for testing)
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validation
        if (!body.userId || !body.total) {
            return NextResponse.json(
                { error: 'User ID and total are required' },
                { status: 400 }
            )
        }

        const order = await prisma.order.create({
            data: {
                userId: body.userId,
                total: body.total,
                status: body.status || 'PENDING'
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

        // Institutional Notifications
        try {
            const { sendInstitutionalMail } = await import("@/lib/mail")
            const { notifyStaff } = await import("@/lib/notifications")

            // 1. Client Confirmation
            await sendInstitutionalMail({
                to: order.user.email!,
                subject: `Order Confirmation #${order.id.slice(-8)} | Mobile Hub`,
                text: `Thank you for your order of LKR ${order.total.toLocaleString()}. We are processing your request.`,
                html: `
                    <div style="font-family: sans-serif; padding: 40px; background: #000; color: #fff;">
                        <h1 style="color: #d4af37;">ORDER CONFIRMED</h1>
                        <p style="font-size: 16px;">Order ID: #${order.id.slice(-8)}</p>
                        <p style="font-size: 14px; color: #888;">Value: LKR ${order.total.toLocaleString()}</p>
                        <p style="margin-top: 30px; font-size: 12px; color: #444;">IDENTIFY THE DIFFERENCE</p>
                    </div>
                `
            })

            // 2. Staff Alert
            await notifyStaff({
                type: "ORDER",
                title: "New Transaction Rooted",
                message: `Order #${order.id.slice(-8)} created by ${order.user.name || order.user.email} (LKR ${order.total.toLocaleString()})`
            })
        } catch (e) {
            console.error("NOTIFICATION_SYSTEM_FAILURE", e)
        }

        return NextResponse.json(order, { status: 201 })
    } catch (error) {
        console.error('Orders POST error:', error)
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        )
    }
}
