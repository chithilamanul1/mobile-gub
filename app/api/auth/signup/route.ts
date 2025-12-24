import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Generate a role based on ADMIN_EMAILS
        const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
        const role = adminEmails.includes(email) ? "ADMIN" : "USER"

        const user = await (prisma.user as any).create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        })

        // 1. Send Welcome Email
        const { sendInstitutionalMail, EMAIL_TEMPLATES } = await import("@/lib/mail")
        await sendInstitutionalMail({
            to: email,
            ...EMAIL_TEMPLATES.WELCOME(name || "Customer")
        })

        // 2. Notify Staff
        const { notifyStaff } = await import("@/lib/notifications")
        await notifyStaff({
            type: "SECURITY",
            title: "New Institutional Registry",
            message: `New user ${name || email} has registered with role: ${role}`
        })

        return NextResponse.json({
            message: "User created successfully",
            user: { id: user.id, email: user.email, role: user.role }
        })

    } catch (error: any) {
        console.error("SIGNUP_ERROR", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
