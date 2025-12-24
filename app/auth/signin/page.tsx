"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaGoogle, FaArrowRight } from "react-icons/fa"
import { motion } from "framer-motion"
import Link from "next/link"

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6 bg-[grid-white-lines] dark:bg-[grid-black-lines]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-12"
            >
                {/* Logo & Intro */}
                <div className="text-center space-y-6">
                    <Link href="/" className="inline-block">
                        <img src="/logo.png" alt="Mobile Hub" className="h-16 w-auto mx-auto drop-shadow-2xl" />
                    </Link>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight uppercase">Welcome to <span className="text-primary">The Hub.</span></h1>
                        <p className="text-gray-400 dark:text-white/30 text-xs font-bold uppercase tracking-widest px-12">
                            Secure access to your certified smartphone vault & premium technical support.
                        </p>
                    </div>
                </div>

                {/* Auth Actions */}
                <div className="space-y-6">
                    <div className="grid gap-4">
                        <Button
                            onClick={() => signIn('google', { callbackUrl: '/my-account' })}
                            className="h-14 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl flex items-center justify-center gap-4 group transition-all"
                        >
                            <FaGoogle className="text-xl group-hover:scale-110 transition-transform" />
                            <span className="font-black text-xs tracking-widest uppercase">Continue with Google</span>
                        </Button>
                    </div>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100 dark:border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.4em]">
                            <span className="bg-white dark:bg-black px-4 text-gray-400">Hub Institution</span>
                        </div>
                    </div>

                    <form className="space-y-4">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Input
                                    type="email"
                                    placeholder="HUB EMAIL"
                                    className="h-16 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-primary rounded-2xl px-6 text-xs font-bold tracking-widest uppercase placeholder:text-gray-300 dark:placeholder:text-white/10 transition-all"
                                />
                            </div>
                            <div className="relative group">
                                <Input
                                    type="password"
                                    placeholder="SECURITY KEY"
                                    className="h-16 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-primary rounded-2xl px-6 text-xs font-bold tracking-widest uppercase placeholder:text-gray-300 dark:placeholder:text-white/10 transition-all"
                                />
                            </div>
                        </div>

                        <Button className="w-full h-16 bg-black dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-xl group">
                            SIGN INTO VAULT <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>
                </div>

                {/* Footer Link */}
                <div className="text-center pt-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Not a member yet?</p>
                    <Link href="/auth/signup" className="text-primary hover:text-black dark:hover:text-white text-[11px] font-black uppercase tracking-widest underline decoration-2 underline-offset-8 transition-colors">
                        REQUEST ACCESS
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
