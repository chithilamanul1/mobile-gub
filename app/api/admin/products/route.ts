import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all products with pagination and search
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '50')
        const skip = (page - 1) * limit

        const where = search ? {
            OR: [
                { model_name: { contains: search, mode: 'insensitive' as const } },
                { brand: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {}

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    imeis: {
                        where: { status: 'AVAILABLE' },
                        select: { id: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.product.count({ where })
        ])

        return NextResponse.json({
            products: products.map((p: any) => ({
                ...p,
                available_imeis: p.imeis.length,
                imeis: undefined // Don't expose full IMEI list in main query
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Products GET error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}

// POST create new product
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validation
        if (!body.brand || !body.model_name) {
            return NextResponse.json(
                { error: 'Brand and model name are required' },
                { status: 400 }
            )
        }

        if (body.price_lkr && body.price_lkr < 0) {
            return NextResponse.json(
                { error: 'Price cannot be negative' },
                { status: 400 }
            )
        }

        const product = await prisma.product.create({
            data: {
                brand: body.brand,
                model_name: body.model_name,
                price_lkr: body.price_lkr || 0,
                stock_count: body.stock_count || 0,
                is_trcsl_approved: body.is_trcsl_approved || false
            }
        })

        // Marketing Automator: Institutional Drop
        if (product.price_lkr > 100000 && process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_ACCESS_TOKEN) {
            try {
                const message = `✨ NEW ARRIVAL: ${product.brand} ${product.model_name}\n\nTechnical Verification Complete. Now available at the Vault.\nPrice: LKR ${product.price_lkr.toLocaleString()}\n\n#MobileHub #IdentifyTheDifference #Authorized`
                // Note: Posting photo requires a separate call or public URL. For text-only or simple link:
                const fbUrl = `https://graph.facebook.com/v21.0/${process.env.FACEBOOK_PAGE_ID}/feed`

                // Fire and forget - don't block response
                fetch(fbUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message,
                        access_token: process.env.FACEBOOK_ACCESS_TOKEN,
                        link: `${process.env.NEXTAUTH_URL}/shop/${product.id}`
                    })
                }).catch(e => console.error("AUTO_POST_ERROR", e))
            } catch (e) {
                // Ignore marketing failures
            }
        }

        return NextResponse.json(product, { status: 201 })
    } catch (error) {
        console.error('Products POST error:', error)
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        )
    }
}
