import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const session = await auth()
    if (!session || (session.user as any).role === "USER") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const configs = await prisma.systemConfig.findMany()
    // Convert array to object
    const settings = configs.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => ({ ...acc, [curr.key]: curr.value }), {})

    return NextResponse.json(settings)
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session || (session.user as any).role === "USER") {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    // Upsert each key
    for (const [key, value] of Object.entries(body)) {
        await prisma.systemConfig.upsert({
            where: { key },
            update: { value: String(value) },
            create: { key, value: String(value) }
        })
    }

    return NextResponse.json({ success: true })
}
