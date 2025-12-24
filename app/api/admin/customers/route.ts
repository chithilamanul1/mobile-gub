import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user || (session.user as any).role === "USER") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const search = searchParams.get("search") || ""
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")
        const sortBy = searchParams.get("sortBy") || "createdAt"
        const sortOrder = searchParams.get("sortOrder") || "desc"

        const skip = (page - 1) * limit

        // Build where clause for search
        const where = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {}

        // Fetch customers with their order data
        const customers = await prisma.user.findMany({
            where,
            include: {
                orders: {
                    select: {
                        total: true,
                        createdAt: true,
                        status: true
                    }
                },
                _count: {
                    select: {
                        orders: true,
                        tickets: true
                    }
                }
            },
            skip,
            take: limit,
            orderBy: sortBy === "totalSpent"
                ? undefined
                : { [sortBy]: sortOrder }
        })

        // Calculate metrics for each customer
        const customersWithMetrics = customers.map((customer: any) => {
            const totalSpent = customer.orders.reduce((sum: number, order: any) => sum + order.total, 0)
            const lastOrder = customer.orders.length > 0
                ? customer.orders.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())[0]
                : null

            return {
                id: customer.id,
                name: customer.name || "Unknown",
                email: customer.email,
                image: customer.image,
                role: customer.role,
                createdAt: customer.createdAt,
                orderCount: customer._count.orders,
                ticketCount: customer._count.tickets,
                totalSpent: Math.round(totalSpent),
                lastOrderDate: lastOrder?.createdAt || null,
                lastOrderStatus: lastOrder?.status || null
            }
        })

        // Sort by totalSpent if requested (client-side since it's computed)
        if (sortBy === "totalSpent") {
            customersWithMetrics.sort((a: any, b: any) =>
                sortOrder === "desc"
                    ? b.totalSpent - a.totalSpent
                    : a.totalSpent - b.totalSpent
            )
        }

        // Get total count for pagination
        const totalCount = await prisma.user.count({ where })

        // Calculate summary statistics
        const allCustomers = await prisma.user.findMany({
            include: {
                orders: {
                    select: { total: true }
                }
            }
        })

        const totalCustomers = allCustomers.length
        const activeCustomers = allCustomers.filter((c: any) => c.orders.length > 0).length
        const totalRevenue = allCustomers.reduce((sum: number, c: any) =>
            sum + c.orders.reduce((orderSum: number, order: any) => orderSum + order.total, 0), 0
        )
        const avgRevenuePerCustomer = activeCustomers > 0 ? totalRevenue / activeCustomers : 0

        return NextResponse.json({
            customers: customersWithMetrics,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit)
            },
            summary: {
                totalCustomers,
                activeCustomers,
                totalRevenue: Math.round(totalRevenue),
                avgRevenuePerCustomer: Math.round(avgRevenuePerCustomer)
            }
        })

    } catch (error) {
        console.error("[CUSTOMERS_ERROR]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
