import { NextResponse } from "next/server"

export async function GET() {
    const pageId = process.env.FACEBOOK_PAGE_ID
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN

    // High-quality mock data for "Happy Customers" if FB API is not configured
    const mockPosts = [
        {
            id: "1",
            message: "Another happy customer joining the Mobile Hub family! 📱✨ Verified iPhone 16 Pro delivered to its new home.",
            full_picture: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1760&auto=format&fit=crop",
            created_time: new Date().toISOString(),
            permalink_url: "https://web.facebook.com/KaushikaRandima"
        },
        {
            id: "2",
            message: "Institutional Excellence. 🏆 Technical verification complete for this flagship Samsung S24 Ultra.",
            full_picture: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1740&auto=format&fit=crop",
            created_time: new Date(Date.now() - 86400000).toISOString(),
            permalink_url: "https://web.facebook.com/KaushikaRandima"
        },
        {
            id: "3",
            message: "The Hub experience is different. Join our community of 10k+ satisfied tech enthusiasts.",
            full_picture: "https://images.unsplash.com/photo-1556656793-018784bd675f?q=80&w=1740&auto=format&fit=crop",
            created_time: new Date(Date.now() - 172800000).toISOString(),
            permalink_url: "https://web.facebook.com/KaushikaRandima"
        }
    ]

    if (!pageId || !accessToken || accessToken === "your_access_token_here") {
        return NextResponse.json(mockPosts)
    }

    try {
        // Facebook Graph API call: GET /v21.0/{page-id}/posts?fields=message,full_picture,created_time,permalink_url&access_token={access-token}
        const fbUrl = `https://graph.facebook.com/v21.0/${pageId}/posts?fields=message,full_picture,created_time,permalink_url&access_token=${accessToken}&limit=6`

        const response = await fetch(fbUrl)
        const data = await response.json()

        if (data.error) {
            console.error("FACEBOOK_API_ERROR", data.error)
            return NextResponse.json(mockPosts)
        }

        // Filter posts that have pictures (Happy Customers)
        const postsWithPictures = data.data?.filter((post: any) => post.full_picture) || []

        return NextResponse.json(postsWithPictures.length > 0 ? postsWithPictures : mockPosts)
    } catch (error) {
        console.error("SOCIAL_SYNC_ERROR", error)
        return NextResponse.json(mockPosts)
    }
}
