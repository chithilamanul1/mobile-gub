
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 })
        }

        const apiKey = process.env.IMGBB_API_KEY
        if (!apiKey) {
            console.error("IMGBB_API_KEY is missing")
            return new NextResponse("Server configuration error", { status: 500 })
        }

        const imgBBFormData = new FormData()
        imgBBFormData.append("image", file)

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: imgBBFormData,
        })

        const data = await response.json()

        if (!data.success) {
            console.error("[IMGBB_ERROR]", data)
            return new NextResponse("Failed to upload to ImgBB", { status: 500 })
        }

        return NextResponse.json({
            url: data.data.url,
            display_url: data.data.display_url,
            delete_url: data.data.delete_url
        })

    } catch (error) {
        console.error("[UPLOAD_ERROR]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
