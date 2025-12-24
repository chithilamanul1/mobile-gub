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
        const period = parseInt(searchParams.get("period") || "30")

        const startDate = new Date()
        startDate.setDate(startDate.getDate() - period)

        // 1. Sales Over Time (Daily aggregation)
        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        })

        // Aggregate by day
        const salesByDay = orders.reduce((acc, order) => {
            const date = order.createdAt.toISOString().split('T')[0]
            if (!acc[date]) {
                acc[date] = { revenue: 0, count: 0 }
            }
            acc[date].revenue += order.total
            acc[date].count += 1
            return acc
        }, {} as Record<string, { revenue: number; count: number }>)

        const salesOverTime = Object.entries(salesByDay)
            .map(([date, data]) => ({
                date,
                revenue: Math.round(data.revenue),
                count: data.count
            }))
            .sort((a, b) => a.date.localeCompare(b.date))

        // 2. Best-Selling Products (by revenue and quantity)
        const productSales = orders.flatMap(order =>
            order.items.map(item => ({
                productId: item.productId,
                revenue: item.product.price_lkr,
                brand: item.product.brand,
                model_name: item.product.model_name
            }))
        )

        const productAggregation = productSales.reduce((acc, sale) => {
            if (!acc[sale.productId]) {
                acc[sale.productId] = {
                    productId: sale.productId,
                    brand: sale.brand,
                    model_name: sale.model_name,
                    revenue: 0,
                    count: 0
                }
            }
            acc[sale.productId].revenue += sale.revenue
            acc[sale.productId].count += 1
            return acc
        }, {} as Record<string, any>)

        const bestSellers = Object.values(productAggregation)
            .sort((a: any, b: any) => b.revenue - a.revenue)
            .slice(0, 10)
            .map((item: any) => ({
                product: `${item.brand} ${item.model_name}`,
                revenue: Math.round(item.revenue),
                count: item.count
            }))

        // 3. Revenue by Category
        const revenueByProduct = bestSellers.slice(0, 5) // Top 5 for chart

        // 4. Low Stock Products (less than 5 units)
        const lowStockProducts = await prisma.product.findMany({
            where: {
                stock_count: { lt: 5 }
            },
            take: 10,
            orderBy: { stock_count: 'asc' }
        })

        // 5. Summary Statistics
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
        const totalSales = orders.length
        const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0

        const totalProducts = await prisma.product.count()
        const totalIMEIs = await prisma.iMEI.count()
        const availableIMEIs = await prisma.iMEI.count({
            where: { status: 'AVAILABLE' }
        })

        // 6. Revenue Forecast (Simple moving average)
        const last7Days = salesOverTime.slice(-7)
        const avgDailyRevenue = last7Days.reduce((sum, day) => sum + day.revenue, 0) / (last7Days.length || 1)
        const forecast = Math.round(avgDailyRevenue * 30) // 30-day projection

        return NextResponse.json({
            period,
            salesOverTime,
            revenueByProduct,
            bestSellers,
            lowStockProducts,
            summary: {
                totalRevenue: Math.round(totalRevenue),
                totalSales,
                avgOrderValue: Math.round(avgOrderValue),
                totalProducts,
                totalIMEIs,
                availableIMEIs,
                forecast
            }
        })

    } catch (error) {
        console.error("[ANALYTICS_ERROR]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
