import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET dashboard statistics
export async function GET() {
    try {
        const [
            totalProducts,
            totalOrders,
            lowStockProducts,
            recentSales
        ] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.product.findMany({
                where: { stock_count: { lt: 3 } },
                select: {
                    id: true,
                    brand: true,
                    model_name: true,
                    stock_count: true
                },
                take: 5
            }),
            prisma.soldDevice.findMany({
                include: {
                    product: {
                        select: {
                            brand: true,
                            model_name: true,
                            price_lkr: true
                        }
                    }
                },
                orderBy: { sold_at: 'desc' },
                take: 5
            })
        ])

        // Calculate revenue (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const recentRevenue = await prisma.soldDevice.findMany({
            where: {
                sold_at: { gte: thirtyDaysAgo }
            },
            include: {
                product: {
                    select: { price_lkr: true }
                }
            }
        })

        const totalRevenue = recentRevenue.reduce(
            (sum, sale) => sum + (sale.product.price_lkr || 0),
            0
        )

        return NextResponse.json({
            stats: {
                totalProducts,
                totalOrders,
                totalRevenue,
                lowStockCount: lowStockProducts.length
            },
            lowStockProducts,
            recentSales: recentSales.map(sale => ({
                id: sale.id,
                productName: `${sale.product.brand} ${sale.product.model_name}`,
                price: sale.product.price_lkr,
                soldAt: sale.sold_at,
                imei: sale.imei
            }))
        })
    } catch (error) {
        console.error('Stats API error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        )
    }
}
