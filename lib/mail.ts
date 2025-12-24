import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
})

export async function sendInstitutionalMail({ to, subject, html, text, attachments }: { to: string, subject: string, html: string, text: string, attachments?: any[] }) {
    try {
        // Fallback for missing env vars
        if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
            console.log("MAIL_SERVICE_MOCK: Sending to", to, "| Subject:", subject)
            return { success: true, mock: true }
        }

        const info = await transporter.sendMail({
            from: `"Mobile Hub" <${process.env.EMAIL_FROM || 'support@mobilehub.lk'}>`,
            to,
            subject,
            text,
            html,
            attachments
        })

        console.log("MAIL_SENT:", info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error("MAIL_ERROR", error)
        return { success: false, error }
    }
}

export const EMAIL_TEMPLATES = {
    WELCOME: (name: string) => ({
        subject: "Welcome to the Institutional Hub",
        html: `
            <div style="font-family: sans-serif; padding: 20px; background: #000; color: #fff;">
                <h1 style="color: #d4af37;">Welcome ${name}!</h1>
                <p>You have successfully registered at Mobile Hub. Experience technical excellence with every interaction.</p>
                <div style="border-top: 1px solid #333; margin-top: 20px; padding-top: 20px;">
                    <p style="font-size: 12px; color: #666;">MOBILE HUB | IDENTIFY THE DIFFERENCE</p>
                </div>
            </div>
        `,
        text: `Welcome ${name}! You have successfully registered at Mobile Hub.`
    }),
    SECURITY_ALERT: (action: string) => ({
        subject: "Institutional Security Alert",
        html: `
            <div style="font-family: sans-serif; padding: 20px; background: #000; color: #fff;">
                <h1 style="color: #ff3b30;">Security Alert</h1>
                <p>A new <strong>${action}</strong> was detected on your account.</p>
                <p>If this wasn't you, please reset your password immediately.</p>
            </div>
        `,
        text: `Security Alert: A new ${action} was detected on your account.`
    })
}
