import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user || (session.user as any).role === "USER") {
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

        // Convert file to base64 for ImgBB API (or send as formData)
        // ImgBB supports multipart/form-data with 'image' field
        const imgBBFormData = new FormData()
        imgBBFormData.append("image", file)

        // Expiration is optional, we want permanent images
        // imgBBFormData.append("expiration", "600") 

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: imgBBFormData,
        })

        const data = await response.json()

        if (!data.success) {
            console.error("[IMGBB_ERROR]", data)
            return new NextResponse("Failed to upload to ImgBB", { status: 500 })
        }

        // Return the direct link to the image
        // ImgBB returns a 'data' object with 'url', 'display_url', etc.
        // We map it to satisfy the ImageUploader component expecting 'url' or 'secure_url'
        return NextResponse.json({
            url: data.data.url,
            secure_url: data.data.url, // For compatibility
            display_url: data.data.display_url,
            delete_url: data.data.delete_url
        })

    } catch (error) {
        console.error("[UPLOAD_ERROR]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
