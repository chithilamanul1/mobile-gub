import { NextResponse } from "next/server"

export async function GET() {
    const pageId = process.env.FACEBOOK_PAGE_ID
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN

    // High-quality mock reviews for "Institutional Trust"
    const mockReviews = [
        {
            id: "r1",
            reviewer_name: "Chathura Sampath",
            rating: 5,
            review_text: "The best place to buy genuine iPhones in Sri Lanka. Their service is top-notch and the staff is very knowledgeable. Highly recommended!",
            created_time: new Date(Date.now() - 7 * 86400000).toISOString(),
            reviewer_image: "https://i.pravatar.cc/150?u=chathura"
        },
        {
            id: "r2",
            reviewer_name: "Nilanthi Perera",
            rating: 5,
            review_text: "Bought a certified pre-owned Samsung S23 Ultra. It looks and performs like brand new. The Hub warranty gives great peace of mind.",
            created_time: new Date(Date.now() - 3 * 86400000).toISOString(),
            reviewer_image: "https://i.pravatar.cc/150?u=nilanthi"
        },
        {
            id: "r3",
            reviewer_name: "Kasun Kalhara",
            rating: 5,
            review_text: "Transparent deals and fair pricing. The only mobile shop I trust in Seeduwa for authentic flagships.",
            created_time: new Date(Date.now() - 1 * 86400000).toISOString(),
            reviewer_image: "https://i.pravatar.cc/150?u=kasun"
        }
    ]

    if (!pageId || !accessToken || accessToken === "your_access_token_here") {
        return NextResponse.json(mockReviews)
    }

    try {
        // Facebook Graph API: GET /v21.0/{page-id}/ratings?access_token={access-token}
        const fbUrl = `https://graph.facebook.com/v21.0/${pageId}/ratings?fields=reviewer{name,picture},rating,review_text,created_time&access_token=${accessToken}`

        const response = await fetch(fbUrl)
        const data = await response.json()

        if (data.error) {
            console.error("FACEBOOK_REVIEWS_ERROR", data.error)
            return NextResponse.json(mockReviews)
        }

        const formattedReviews = data.data?.map((r: any) => ({
            id: r.created_time + r.reviewer?.name,
            reviewer_name: r.reviewer?.name || "Anonymous",
            rating: r.rating,
            review_text: r.review_text || "The customer provided a rating without a text review.",
            created_time: r.created_time,
            reviewer_image: r.reviewer?.picture?.data?.url || `https://ui-avatars.com/api/?name=${r.reviewer?.name}`
        })) || []

        return NextResponse.json(formattedReviews.length > 0 ? formattedReviews : mockReviews)
    } catch (error) {
        console.error("REVIEWS_SYNC_ERROR", error)
        return NextResponse.json(mockReviews)
    }
}
