import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const session = await auth()
    if (!session || (session.user as any).role === "USER") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
    })

    const unreadCount = await prisma.notification.count({
        where: { read: false }
    })

    return NextResponse.json({ notifications, unreadCount })
}

export async function PUT(req: Request) {
    const session = await auth()
    if (!session || (session.user as any).role === "USER") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // Mark all as read for now, or specific ID if passed
    await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true }
    })

    return NextResponse.json({ success: true })
}
