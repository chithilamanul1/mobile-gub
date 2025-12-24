import { NextResponse } from "next/server"

export async function GET() {
    const pageId = process.env.FACEBOOK_PAGE_ID
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN

    // Institutional Mock Data
    const mockStats = {
        followers: 12500,
        reach: 45000,
        engagement: 8.5,
        growth: 12
    }

    if (!pageId || !accessToken || accessToken === "your_access_token_here") {
        return NextResponse.json(mockStats)
    }

    try {
        // Facebook Graph API: GET /v21.0/{page-id}?fields=fan_count,rating_count,overall_star_rating...
        // Note: 'fan_count' is likes. 'followers_count' is followers.
        const fbUrl = `https://graph.facebook.com/v21.0/${pageId}?fields=followers_count,fan_count,rating_count,overall_star_rating&access_token=${accessToken}`

        const response = await fetch(fbUrl)
        const data = await response.json()

        if (data.error) {
            console.error("SOCIAL_STATS_ERROR", data.error)
            return NextResponse.json(mockStats)
        }

        return NextResponse.json({
            followers: data.followers_count || mockStats.followers,
            reach: Math.floor((data.followers_count || mockStats.followers) * 3.5), // Estimate based on followers
            engagement: 8.5, // Requires Insights API which needs specific permissions, mocking for now
            growth: 12 // Hardcoded growth trend
        })

    } catch (error) {
        console.error("SOCIAL_STATS_SYNC_ERROR", error)
        return NextResponse.json(mockStats)
    }
}
