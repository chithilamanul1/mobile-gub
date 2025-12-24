import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { sendInstitutionalMail } from "@/lib/mail"
import { notifyStaff } from "@/lib/notifications"

export async function POST(req: Request) {
    try {
        const { brand, model, storage, condition, defects, name, email, phone } = await req.json()

        // 1. Find or Create User
        let user = await (prisma as any).user.findUnique({
            where: { email }
        })

        if (!user) {
            // Create guest user
            user = await (prisma as any).user.create({
                data: {
                    email,
                    name,
                    role: "USER",
                    // No password set intentionally (Guest)
                }
            })
        }

        // 2. Create Ticket
        const subject = `Trade-In Quote: ${brand} ${model} (${storage})`
        const description = `
**Trade-In Request**

*Device Details*
**Brand:** ${brand}
**Model:** ${model}
**Storage:** ${storage}

*Condition*
**Condition:** ${condition}
**Defects:** ${defects || "None declared"}

*Customer Contact*
**Name:** ${name}
**Phone:** ${phone}
**Email:** ${email}
        `.trim()

        const ticket = await (prisma as any).ticket.create({
            data: {
                subject,
                description,
                priority: "NORMAL",
                userId: user.id
            }
        })

        // 3. Notifications
        try {
            // Client Email
            await sendInstitutionalMail({
                to: email,
                subject: `Quote Request Received: ${brand} ${model}`,
                text: `We have received your trade-in request for ${brand} ${model}. Ticket #${ticket.id.slice(-6)}.`,
                html: `
                    <div style="font-family: sans-serif; padding: 40px; background: #000; color: #fff; border-left: 4px solid #d4af37;">
                        <h2 style="color: #d4af37; text-transform: uppercase;">Trade-In Request Received</h2>
                        <p style="font-size: 14px;"><strong>Device:</strong> ${brand} ${model} ${storage}</p>
                        <p style="font-size: 14px;"><strong>Condition:</strong> ${condition}</p>
                        <p style="margin-top: 20px; font-size: 14px;"><strong>Reference ID:</strong> #${ticket.id.slice(-6)}</p>
                        <p style="margin-top: 20px; font-size: 12px; color: #666;">
                            Our valuation team will review these details and send a preliminary offer to your email within 24 hours.
                        </p>
                    </div>
                `
            })

            // Staff Alert
            await notifyStaff({
                type: "TICKET",
                title: "New Trade-In Request",
                message: `${name} wants to trade in ${brand} ${model} (${condition})`
            })

        } catch (e) {
            console.error("NOTIFICATION_ERROR", e)
        }

        return NextResponse.json({ success: true, ticketId: ticket.id })

    } catch (error) {
        console.error("TRADE_IN_ERROR", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
