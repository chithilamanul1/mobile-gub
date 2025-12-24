
import { jsPDF } from "jspdf"
import { sendInstitutionalMail } from "@/lib/mail"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user || (session.user as any).role === "USER") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { ticketId, userEmail, quoteAmount, deviceName, validUntil } = await req.json()

        // 1. Generate PDF
        const doc = new jsPDF()

        // --- Branding ---
        doc.setFillColor(0, 0, 0) // Black BG
        doc.rect(0, 0, 210, 297, "F")

        doc.setTextColor(212, 175, 55) // Gold
        doc.setFontSize(24)
        doc.setFont("helvetica", "bold")
        doc.text("MOBILE HUB", 105, 30, { align: "center" })

        doc.setFontSize(10)
        doc.setTextColor(255, 255, 255)
        doc.text("INSTITUTIONAL TRADE-IN PROGRAM", 105, 40, { align: "center" })

        // --- Quote Details ---
        doc.setDrawColor(255, 255, 255)
        doc.setLineWidth(0.5)
        doc.line(20, 50, 190, 50)

        doc.setFontSize(14)
        doc.text(`Official Valuation: ${deviceName}`, 20, 70)

        doc.setFontSize(12)
        doc.setTextColor(200, 200, 200)
        doc.text(`Reference Ticket: #${ticketId.slice(-6).toUpperCase()}`, 20, 80)
        doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 20, 90)
        doc.text(`Valid Until: ${validUntil}`, 20, 100)

        // --- Price Box ---
        doc.setFillColor(20, 20, 20)
        doc.setDrawColor(212, 175, 55)
        doc.rect(50, 120, 110, 50, "FD")

        doc.setFontSize(16)
        doc.setTextColor(255, 255, 255)
        doc.text("TRADE-IN VALUE", 105, 135, { align: "center" })

        doc.setFontSize(30)
        doc.setTextColor(212, 175, 55)
        doc.text(`LKR ${parseInt(quoteAmount).toLocaleString()}`, 105, 155, { align: "center" })

        // --- Footer ---
        doc.setFontSize(10)
        doc.setTextColor(150, 150, 150)
        doc.text("Present this document at any Mobile Hub location or use the reference code online.", 105, 200, { align: "center" })
        doc.text("Authorized by Mobile Hub Valuation Team.", 105, 210, { align: "center" })

        const pdfBuffer = doc.output("arraybuffer")
        const pdfBase64 = Buffer.from(pdfBuffer).toString("base64")

        // 2. Send Email
        await sendInstitutionalMail({
            to: userEmail,
            subject: `Action Required: Your Trade-In Quote is Ready (${deviceName})`,
            text: `Your trade-in quote for ${deviceName} is ready. Value: LKR ${quoteAmount}. See attached PDF.`,
            html: `
                <div style="background: #000; color: #fff; padding: 40px; font-family: sans-serif;">
                    <h1 style="color: #d4af37;">Quote Ready</h1>
                    <p>Good news! Our team has completed the valuation of your <strong>${deviceName}</strong>.</p>
                    <div style="background: #111; padding: 20px; border: 1px solid #333; margin: 20px 0;">
                        <span style="display: block; font-size: 12px; color: #888;">OFFER VALUE</span>
                        <span style="display: block; font-size: 24px; font-weight: bold; color: #fff;">LKR ${parseInt(quoteAmount).toLocaleString()}</span>
                    </div>
                    <p>Please find the official quote PDF attached. This offer is valid until ${validUntil}.</p>
                    <p style="font-size: 12px; color: #666; margin-top: 30px;">Mobile Hub | Institutional Trade-In</p>
                </div>
            `,
            attachments: [
                {
                    filename: `Quote_${ticketId.slice(-6)}.pdf`,
                    content: pdfBase64,
                    encoding: "base64"
                }
            ]
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("QUOTE_ERROR", error)
        return new NextResponse("Failed to generate quote", { status: 500 })
    }
}
