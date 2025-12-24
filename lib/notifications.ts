import { sendInstitutionalMail, EMAIL_TEMPLATES } from "@/lib/mail"

export async function notifyStaff({ type, title, message }: { type: 'ORDER' | 'TICKET' | 'SECURITY', title: string, message: string }) {
    // 1. Send to Admin Emails defined in .env
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []

    // 2. Persist to Database for In-App Alerts
    try {
        // We use a dynamic import or checking if prisma is available to avoid circular deps if needed,
        // but importing standard singleton is fine.
        const { prisma } = await import("@/lib/prisma")
        await prisma.notification.create({
            data: {
                type,
                title,
                message,
                read: false
            }
        })
    } catch (e) {
        console.error("FAILED_TO_PERSIST_NOTIFICATION", e)
    }

    /*
    for (const email of adminEmails) {
        await sendInstitutionalMail({
            to: email.trim(),
            subject: `[STAFF ALERT] ${type}: ${title}`,
            text: message,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background: #080808; border-left: 4px solid #d4af37; color: #fff;">
                    <h2 style="color: #d4af37; margin-bottom: 10px;">${type} ALERT</h2>
                    <h3 style="color: #fff; margin-bottom: 15px;">${title}</h3>
                    <p style="color: #666; font-size: 14px; line-height: 1.6;">${message}</p>
                    <div style="margin-top: 30px; border-top: 1px solid #222; padding-top: 15px;">
                        <p style="font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 2px;">Mobile Hub Command Center</p>
                    </div>
                </div>
            `
        })
    }
    */
    console.log(`STAFF_NOTIFICATION_PUSHED: ${type} - ${title}`)
}
