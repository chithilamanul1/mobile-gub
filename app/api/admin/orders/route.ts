
import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

// GET all orders with filters
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') || 'all'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '50')
        // Firestore offset is expensive (reads all prior docs), but for admin dashboard with < 1000 orders it's fine.
        // Better approach: cursors (startAfter). Sticking to offset logic in memory for migration simplicity if dataset small, 
        // or using basic query limits.

        // Fetch ALL for filtering/pagination in memory (easiest migration path for small scale)
        const ordersRef = adminDb.collection('orders')
        let query = status !== 'all' ? ordersRef.where('status', '==', status) : ordersRef

        const snapshot = await query.get()
        let allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]

        // Sort desc
        allOrders.sort((a, b) => {
            const dateA = new Date(a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt).getTime()
            const dateB = new Date(b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt).getTime()
            return dateB - dateA
        })

        const total = allOrders.length
        const start = (page - 1) * limit
        const paginatedOrders = allOrders.slice(start, start + limit)

        // Hydrate User Data (Manual Join)
        const userIds = [...new Set(paginatedOrders.map(o => o.userId))]
        const usersMap = new Map()
        if (userIds.length > 0) {
            const userSnaps = await Promise.all(userIds.map(uid => adminDb.collection('users').doc(uid).get()))
            userSnaps.forEach(snap => {
                if (snap.exists) usersMap.set(snap.id, snap.data())
            })
        }

        // Hydrate Product Data for Items (Manual Join)
        // Items array structure: [{ productId: '...', quantity: 1, ... }]
        // We need to fetch product info for display

        // This can be complex. Ideally, Order *snapshot* should contain product details (price, name) 
        // at the time of purchase so it doesn't change later.
        // Assuming the migration or typical order flow does that.
        // If 'items' contains productId only, we must fetch.
        // Let's assume current Items have full data, or we fetch if missing.

        const enrichedOrders = paginatedOrders.map(order => ({
            ...order,
            user: usersMap.get(order.userId) || { name: 'Unknown', email: 'unknown@example.com' },
            itemCount: order.items?.length || 0,
            createdAt: order.createdAt?.toDate ? order.createdAt.toDate() : order.createdAt
        }))

        return NextResponse.json({
            orders: enrichedOrders,
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

        const orderData = {
            userId: body.userId,
            total: body.total,
            status: body.status || 'PENDING',
            items: body.items || [],
            createdAt: new Date()
        }

        const docRef = await adminDb.collection('orders').add(orderData)
        const userSnap = await adminDb.collection('users').doc(body.userId).get()
        const userData = userSnap.data() || { email: 'unknown', name: 'User' }

        const order = { id: docRef.id, ...orderData, user: userData }

        // Institutional Notifications
        try {
            const { sendInstitutionalMail } = await import("@/lib/mail")
            const { notifyStaff } = await import("@/lib/notifications")

            // 1. Client Confirmation
            await sendInstitutionalMail({
                to: userData.email,
                subject: `Order Confirmation #${docRef.id.slice(-8)} | Mobile Hub`,
                text: `Thank you for your order of LKR ${order.total.toLocaleString()}. We are processing your request.`,
                html: `
                    <div style="font-family: sans-serif; padding: 40px; background: #000; color: #fff;">
                        <h1 style="color: #d4af37;">ORDER CONFIRMED</h1>
                        <p style="font-size: 16px;">Order ID: #${docRef.id.slice(-8)}</p>
                        <p style="font-size: 14px; color: #888;">Value: LKR ${order.total.toLocaleString()}</p>
                        <p style="margin-top: 30px; font-size: 12px; color: #444;">IDENTIFY THE DIFFERENCE</p>
                    </div>
                `
            })

            // 2. Staff Alert
            await notifyStaff({
                type: "ORDER",
                title: "New Transaction Rooted",
                message: `Order #${docRef.id.slice(-8)} created by ${userData.name || userData.email} (LKR ${order.total.toLocaleString()})`
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
