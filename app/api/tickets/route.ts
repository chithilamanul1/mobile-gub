import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const { subject, description, priority } = await req.json()

        // Use user email to find or link user if needed, but session usually has user id in database adapters
        // PrismaAdapter links the user email to the session
        const user = await (prisma as any).user.findUnique({
            where: { email: session.user.email! }
        })

        if (!user) return new NextResponse("User not found", { status: 404 })

        if (!(prisma as any).ticket) {
            return new NextResponse("Ticket module not loaded", { status: 503 })
        }

        const ticket = await (prisma as any).ticket.create({
            data: {
                subject,
                description,
                priority: priority || "NORMAL",
                userId: (user as any).id
            }
        })

        // Institutional Notifications
        try {
            const { sendInstitutionalMail } = await import("@/lib/mail")
            const { notifyStaff } = await import("@/lib/notifications")

            // 1. Client Acknowledgment
            await sendInstitutionalMail({
                to: user.email!,
                subject: `Ticket Opened: ${subject} | Mobile Hub`,
                text: `Your support request has been registered as #${ticket.id.slice(-6)}. Our technical staff will review it shortly.`,
                html: `
                    <div style="font-family: sans-serif; padding: 40px; background: #000; color: #fff; border-left: 4px solid #d4af37;">
                        <h2 style="color: #d4af37; text-transform: uppercase;">Technical Request Received</h2>
                        <p style="font-size: 14px;"><strong>Subject:</strong> ${subject}</p>
                        <p style="font-size: 14px;"><strong>Ticket ID:</strong> #${ticket.id.slice(-6)}</p>
                        <p style="margin-top: 20px; font-size: 12px; color: #666;">We prioritize institutional reliability. Our staff will contact you via this ticket.</p>
                    </div>
                `
            })

            // 2. Staff Alert
            await notifyStaff({
                type: "TICKET",
                title: "New Support Stream",
                message: `Ticket from ${user.name || user.email}: ${subject} (Priority: ${priority || 'NORMAL'})`
            })
        } catch (e) {
            console.error("NOTIFICATION_SYSTEM_FAILURE", e)
        }

        return NextResponse.json(ticket)
    } catch (error) {
        console.error("TICKET_CREATE_ERROR", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(req: Request) {
    const session = await auth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const user = await (prisma as any).user.findUnique({
            where: { email: session.user.email! }
        })

        if (!user) return new NextResponse("User not found", { status: 404 })

        if (!(prisma as any).ticket) {
            return NextResponse.json([])
        }

        const tickets = await (prisma as any).ticket.findMany({
            where: { userId: (user as any).id },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(tickets)
    } catch (error) {
        console.error("TICKET_LIST_ERROR", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
