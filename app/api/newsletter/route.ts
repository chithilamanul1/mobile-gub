import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const existingAddress = await (prisma as any).newsletterSubscriber.findUnique({
            where: { email }
        })

        if (existingAddress) {
            if (!existingAddress.isActive) {
                await (prisma as any).newsletterSubscriber.update({
                    where: { email },
                    data: { isActive: true }
                })
                return NextResponse.json({ message: "Subscription reactivated" })
            }
            return NextResponse.json({ message: "Already subscribed" })
        }

        await (prisma as any).newsletterSubscriber.create({
            data: { email }
        })

        return NextResponse.json({ message: "Subscribed successfully" })

    } catch (error) {
        console.error("NEWSLETTER_ERROR", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
