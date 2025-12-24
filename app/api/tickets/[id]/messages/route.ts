import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { id } = await params
        const { content } = await req.json()

        const user = await (prisma as any).user.findUnique({
            where: { email: session.user.email! }
        })

        if (!user) return new NextResponse("User not found", { status: 404 })

        if (!(prisma as any).ticket || !(prisma as any).ticketMessage) {
            return new NextResponse("Ticket module not loaded", { status: 503 })
        }

        // Verify ticket ownership
        const ticket = await (prisma as any).ticket.findUnique({
            where: { id, userId: (user as any).id }
        })

        if (!ticket) return new NextResponse("Ticket not found or unauthorized", { status: 403 })

        const message = await (prisma as any).ticketMessage.create({
            data: {
                content,
                senderRole: "USER",
                ticketId: id
            }
        })

        // Notify Staff
        const { notifyStaff } = await import("@/lib/notifications")
        await notifyStaff({
            type: "TICKET",
            title: `New Msg: ${ticket.subject}`,
            message: `${session.user.name}: ${content}`
        })

        return NextResponse.json(message)
    } catch (error) {
        console.error("MESSAGE_CREATE_ERROR", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { id } = await params

        const user = await (prisma as any).user.findUnique({
            where: { email: session.user.email! }
        })

        if (!user) return new NextResponse("User not found", { status: 404 })

        if (!(prisma as any).ticket) {
            return new NextResponse("Ticket module not loaded", { status: 503 })
        }

        // Verify ticket ownership
        const ticket = await (prisma as any).ticket.findUnique({
            where: { id, userId: (user as any).id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        })

        if (!ticket) return new NextResponse("Ticket not found or unauthorized", { status: 403 })

        return NextResponse.json(ticket)
    } catch (error) {
        console.error("TICKET_DETAIL_ERROR", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
