import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { adminDb } from "@/lib/firebase-admin"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: FirestoreAdapter(adminDb),
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

                // Query Firestore for user
                const usersRef = adminDb.collection("users")
                const querySnapshot = await usersRef.where("email", "==", credentials.email).limit(1).get()

                if (querySnapshot.empty) {
                    // Fallback for hardcoded admin if not in DB yet
                    if (credentials.email === "admin@mobilehub.lk" && credentials.password === "admin123") {
                        // We can import mail here if needed, keeping it simple for now
                        return { id: "admin-1", name: "Kaushika Owner", email: "admin@mobilehub.lk", role: "OWNER" }
                    }
                    return null
                }

                const userDoc = querySnapshot.docs[0]
                const user = userDoc.data()

                if (!user || !user.password) return null

                const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password)

                if (!isPasswordValid) return null

                return { id: userDoc.id, ...user } as any
            }
        })
    ],
    callbacks: {
        async session({ session, token }: any) {
            if (session.user) {
                const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []

                // Check StaffAccess collection (Role Override)
                // Assuming 'staff_access' collection exists
                try {
                    const staffRef = adminDb.collection("staff_access").where("email", "==", session.user.email).limit(1)
                    const staffSnap = await staffRef.get()

                    if (!staffSnap.empty) {
                        const staff = staffSnap.docs[0].data()
                        session.user.role = staff.role
                        session.user.permissions = JSON.parse(staff.permissions || "[]")
                    } else if (adminEmails.includes(session.user.email)) {
                        session.user.role = "ADMIN"
                    } else if (token?.role) {
                        session.user.role = token.role
                    }
                } catch (e) {
                    // Fallback if permission check fails
                    if (adminEmails.includes(session.user.email)) session.user.role = "ADMIN"
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
