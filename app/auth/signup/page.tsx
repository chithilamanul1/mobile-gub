"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { FaFingerprint, FaEnvelope, FaUser, FaLock, FaArrowRight } from "react-icons/fa"

export default function SignupPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const name = formData.get("name")
        const email = formData.get("email")
        const password = formData.get("password")

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Account created successfully. Welcome to the Hub.")
                router.push("/auth/signin")
            } else {
                toast.error(data.error || "Signup failed")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[url('/grid.svg')] bg-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center space-y-4">
                    <img src="/logo.png" alt="Mobile Hub" className="h-12 w-auto mx-auto border-b border-primary/20 pb-4" />
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <FaFingerprint className="text-sm" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase">INSTITUTIONAL REGISTRY</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight uppercase italic">Secure Vault Access</h1>
                </div>

                <div className="bg-[#080808] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-20 group-hover:opacity-100 transition-opacity" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">FULL NAME</Label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                <Input
                                    name="name"
                                    placeholder="KAUSHIKA RANDIMA"
                                    required
                                    className="bg-white/5 border-white/10 rounded-2xl pl-12 h-14 text-sm font-bold placeholder:text-white/10 focus:border-primary/40 focus:ring-0 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">VAULT EMAIL</Label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="OWNER@MOBILEHUB.LK"
                                    required
                                    className="bg-white/5 border-white/10 rounded-2xl pl-12 h-14 text-sm font-bold placeholder:text-white/10 focus:border-primary/40 focus:ring-0 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">ACCESS KEY (PASSWORD)</Label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="bg-white/5 border-white/10 rounded-2xl pl-12 h-14 text-sm font-bold placeholder:text-white/10 focus:border-primary/40 focus:ring-0 transition-all"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[11px] group overflow-hidden relative"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? "ENCRYPTING ACCESS..." : "INITIALIZE ACCOUNT"}
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <Link href="/auth/signin" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-primary transition-colors">
                            Already have vault access? Sign In
                        </Link>
                    </div>
                </div>

                <p className="text-center text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] max-w-xs mx-auto">
                    By initializing your account, you agree to our Institutional Terms of Engagement and technical service protocols.
                </p>
            </motion.div>
        </div>
    )
}
