import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // Fallback for testing/admin without Google keys
        Credentials({
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if (!user || !(user as any).password) {
                    // Fallback for hardcoded admin if not in DB yet
                    if (credentials.email === "admin@mobilehub.lk" && credentials.password === "admin123") {
                        const { sendInstitutionalMail, EMAIL_TEMPLATES } = await import("@/lib/mail")
                        await sendInstitutionalMail({
                            to: "admin@mobilehub.lk",
                            ...EMAIL_TEMPLATES.SECURITY_ALERT("Admin Console Access")
                        })
                        return { id: "admin-1", name: "Kaushika Owner", email: "admin@mobilehub.lk", role: "OWNER" }
                    }
                    return null
                }

                const isPasswordValid = await bcrypt.compare(credentials.password as string, (user as any).password)

                if (!isPasswordValid) return null

                return user
            }
        })
    ],
    callbacks: {
        async session({ session, token }: any) {
            if (session.user) {
                const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []

                // Check StaffAccess table for role override
                const staff = await prisma.staffAccess.findUnique({
                    where: { email: session.user.email }
                })

                if (staff) {
                    session.user.role = staff.role
                    session.user.permissions = JSON.parse(staff.permissions || "[]")
                } else if (adminEmails.includes(session.user.email)) {
                    session.user.role = "ADMIN"
                } else if (token?.role) {
                    session.user.role = token.role
                }
            }
            return session
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.role = (user as any).role
            }
            return token
        }
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: { strategy: "jwt" }
})
