import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    const isAdminRoute = nextUrl.pathname.startsWith("/admin")
    const isSettingsRoute = nextUrl.pathname.startsWith("/admin/settings")

    if (isApiAuthRoute) {
        return null
    }

    // Admin route protection
    if (isAdminRoute) {
        if (!isLoggedIn) {
            const signInUrl = new URL("/api/auth/signin", nextUrl)
            signInUrl.searchParams.set('callbackUrl', nextUrl.pathname)
            return NextResponse.redirect(signInUrl)
        }

        // Check Role from database
        const role = (req.auth?.user as any)?.role

        // Owner-only routes
        if (isSettingsRoute && role !== "OWNER") {
            return NextResponse.redirect(new URL("/admin", nextUrl))
        }

        // Admin/Owner access required
        if (role !== "ADMIN" && role !== "OWNER") {
            // Check email-based admin list as fallback
            const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
            const userEmail = req.auth?.user?.email

            if (!userEmail || !adminEmails.includes(userEmail)) {
                const homeUrl = new URL("/", nextUrl)
                homeUrl.searchParams.set('error', 'unauthorized')
                return NextResponse.redirect(homeUrl)
            }
        }
    }

    return null
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
