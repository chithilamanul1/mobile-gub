import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user || (session.user as any).role === "USER") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await params

        // Fetch customer with full details
        const customer = await prisma.user.findUnique({
            where: { id },
            include: {
                orders: {
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                tickets: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                _count: {
                    select: {
                        orders: true,
                        tickets: true
                    }
                }
            }
        })

        if (!customer) {
            return new NextResponse("Customer not found", { status: 404 })
        }

        // Calculate customer metrics
        const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0)
        const avgOrderValue = customer.orders.length > 0 ? totalSpent / customer.orders.length : 0

        // Build activity timeline
        const activities = [
            ...customer.orders.map(order => ({
                type: 'order' as const,
                date: order.createdAt,
                description: `Order #${order.id.slice(0, 8)} - ${order.status}`,
                amount: order.total,
                status: order.status
            })),
            ...customer.tickets.map(ticket => ({
                type: 'ticket' as const,
                date: ticket.createdAt,
                description: `Support Ticket - ${ticket.subject}`,
                status: ticket.status
            }))
        ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10)

        return NextResponse.json({
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                image: customer.image,
                role: customer.role,
                createdAt: customer.createdAt,
                emailVerified: customer.emailVerified
            },
            metrics: {
                totalOrders: customer._count.orders,
                totalTickets: customer._count.tickets,
                totalSpent: Math.round(totalSpent),
                avgOrderValue: Math.round(avgOrderValue)
            },
            orders: customer.orders.map(order => ({
                id: order.id,
                createdAt: order.createdAt,
                status: order.status,
                total: order.total,
                itemCount: order.items.length,
                items: order.items.map(item => ({
                    product: `${item.product.brand} ${item.product.model_name}`,
                    price: item.product.price_lkr
                }))
            })),
            recentTickets: customer.tickets.map(ticket => ({
                id: ticket.id,
                subject: ticket.subject,
                status: ticket.status,
                priority: ticket.priority,
                createdAt: ticket.createdAt
            })),
            activities
        })

    } catch (error) {
        console.error("[CUSTOMER_DETAIL_ERROR]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
