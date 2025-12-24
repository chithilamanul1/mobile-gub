import { NextResponse } from "next/server"

export async function GET() {
    const pageId = process.env.FACEBOOK_PAGE_ID
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN

    // Institutional Visuals Mock
    const mockAlbums = [
        {
            id: "a1",
            name: "Flagship Collection 2024",
            cover_photo: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1600&auto=format&fit=crop",
            count: 12
        },
        {
            id: "a2",
            name: "Happy Customers",
            cover_photo: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1600&auto=format&fit=crop",
            count: 154
        },
        {
            id: "a3",
            name: "The Hub Experience",
            cover_photo: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
            count: 45
        }
    ]

    if (!pageId || !accessToken || accessToken === "your_access_token_here") {
        return NextResponse.json(mockAlbums)
    }

    try {
        const fbUrl = `https://graph.facebook.com/v21.0/${pageId}/albums?fields=name,cover_photo{source},count&access_token=${accessToken}`
        const response = await fetch(fbUrl)
        const data = await response.json()

        if (data.error) {
            console.error("ALBUMS_SYNC_ERROR", data.error)
            return NextResponse.json(mockAlbums)
        }

        const formattedAlbums = data.data?.map((album: any) => ({
            id: album.id,
            name: album.name,
            cover_photo: album.cover_photo?.source || mockAlbums[0].cover_photo,
            count: album.count || 0
        })) || []

        return NextResponse.json(formattedAlbums.length > 0 ? formattedAlbums : mockAlbums)

    } catch (error) {
        console.error("ALBUMS_SYNC_ERROR", error)
        return NextResponse.json(mockAlbums)
    }
}
