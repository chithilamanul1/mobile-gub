import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()

    // Auth Check
    if (!session?.user || (session.user as any).role === "USER") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { id } = await params
        const { content } = await req.json()

        if (!(prisma as any).ticketMessage) {
            return new NextResponse("Database Error: TicketMessage model not found", { status: 500 })
        }

        const message = await (prisma as any).ticketMessage.create({
            data: {
                content,
                senderRole: "ADMIN",
                ticketId: id
            }
        })

        // Also update ticket status to IN_PROGRESS if it was OPEN
        await (prisma as any).ticket.update({
            where: { id },
            data: { status: "IN_PROGRESS" }
        })

        // Institutional Notifications
        try {
            const ticketDetail = await (prisma as any).ticket.findUnique({
                where: { id },
                include: { user: true }
            })

            if (ticketDetail?.user?.email) {
                const { sendInstitutionalMail } = await import("@/lib/mail")
                await sendInstitutionalMail({
                    to: ticketDetail.user.email,
                    subject: `Re: ${ticketDetail.subject} | Mobile Hub Support`,
                    text: `A technical staff member has replied to your request: "${content.slice(0, 100)}..."`,
                    html: `
                        <div style="font-family: sans-serif; padding: 40px; background: #000; color: #fff;">
                            <div style="border-left: 4px solid #d4af37; padding-left: 20px;">
                                <h2 style="color: #d4af37; text-transform: uppercase; font-size: 14px; letter-spacing: 2px;">Technical Response</h2>
                                <p style="font-size: 16px; line-height: 1.6;">${content}</p>
                            </div>
                            <div style="margin-top: 40px; border-top: 1px solid #111; padding-top: 20px;">
                                <p style="font-size: 10px; color: #444; text-transform: uppercase;">Ticket Reference: #${id.slice(-6)}</p>
                                <a href="http://localhost:3000/support/tickets/${id}" style="display: inline-block; margin-top: 15px; background: #d4af37; color: #000; padding: 10px 20px; text-decoration: none; font-weight: 900; font-size: 10px; border-radius: 4px; text-transform: uppercase;">View Full Thread</a>
                            </div>
                        </div>
                    `
                })
            }
        } catch (e) {
            console.error("NOTIFICATION_SYSTEM_FAILURE", e)
        }

        return NextResponse.json(message)
    } catch (error) {
        console.error("ADMIN_TICKET_REPLY_ERROR", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
