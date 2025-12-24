"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MegaMenu } from "@/components/layout/MegaMenu"
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaChevronDown, FaTicketAlt, FaSignOutAlt } from "react-icons/fa"
import { MdClose } from "react-icons/md"
import { cn } from "@/lib/utils"

function UserMenuLink({ href, icon, label }: { href: string, icon: any, label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all"
        >
            <span className="text-sm">{icon}</span>
            {label}
        </Link>
    )
}

export function Navbar() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)

    if (pathname?.startsWith("/admin")) return null
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 w-full z-50 transition-all duration-300",
                    scrolled ? "h-20 bg-background/90 backdrop-blur-lg border-b border-white/5 shadow-sm" : "h-24 bg-transparent"
                )}
            >
                <div className="container mx-auto h-full px-6 flex items-center justify-between">
                    {/* Logo & Toggle */}
                    <div className="flex items-center gap-8">
                        <button className="lg:hidden p-2 -ml-2 text-gray-900 dark:text-white">
                            <FaBars className="w-5 h-5" />
                        </button>

                        <Link href="/" className="flex items-center gap-3 group">
                            <img src="/logo.png" alt="Mobile Hub" className="h-10 w-auto transition-transform group-hover:scale-105" />
                        </Link>
                    </div>

                    {/* Clean Navigation */}
                    <nav className="hidden lg:flex items-center gap-10">
                        <Link href="/" className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-white/40 hover:text-primary dark:hover:text-primary transition-colors">HOME</Link>
                        <MegaMenu />
                        <Link href="/shop" className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-white/40 hover:text-primary dark:hover:text-primary transition-colors">SHOP ALL</Link>
                        <Link href="/trade-in" className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-white/40 hover:text-primary dark:hover:text-primary transition-colors">TRADE-IN</Link>
                        <Link href="/repairs" className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-white/40 hover:text-primary dark:hover:text-primary transition-colors">SERVICE</Link>
                    </nav>

                    {/* Utility & Account */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-3 text-gray-500 dark:text-white/40 hover:text-primary transition-colors hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
                        >
                            <FaSearch className="w-4 h-4" />
                        </button>

                        <Link href="/cart" className="relative p-3 text-gray-500 dark:text-white/40 hover:text-primary transition-colors hover:bg-gray-100 dark:hover:bg-white/5 rounded-full group">
                            <FaShoppingCart className="w-4 h-4" />
                            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-black text-[9px] font-black rounded-full flex items-center justify-center">0</span>
                        </Link>

                        <div className="h-6 w-[1px] bg-gray-200 dark:bg-white/10 mx-2 hidden md:block" />

                        {session ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 p-1 pr-3 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/10 hover:border-primary/30 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
                                        {session.user?.image ? (
                                            <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-primary flex items-center justify-center text-black font-bold text-xs">
                                                {session.user?.name?.[0] || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white hidden sm:block">
                                        {session.user?.name?.split(' ')[0]}
                                    </span>
                                    <FaChevronDown className={cn("w-2 h-2 text-gray-400 transition-transform", isUserMenuOpen ? "rotate-180" : "")} />
                                </button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-4 w-64 bg-surface border border-white/10 rounded-2xl shadow-2xl p-2 z-[60]"
                                        >
                                            <div className="p-4 border-b border-gray-50 dark:border-white/5">
                                                <p className="text-[10px] font-black text-primary tracking-widest uppercase mb-1">Authenticated Hub Member</p>
                                                <p className="text-sm font-black text-gray-900 dark:text-white truncate">{session.user?.name}</p>
                                            </div>

                                            <div className="p-2 space-y-1">
                                                {(session?.user as any)?.role === 'ADMIN' || (session?.user as any)?.role === 'OWNER' ? (
                                                    <UserMenuLink href="/admin" icon={<FaBars />} label="ADMIN CONSOLE" />
                                                ) : null}
                                                <UserMenuLink href="/my-account" icon={<FaUser />} label="VAULT DASHBOARD" />
                                                <UserMenuLink href="/my-account/tickets" icon={<FaTicketAlt />} label="SUPPORT TICKETS" />
                                                <button
                                                    onClick={() => signOut()}
                                                    className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 rounded-xl transition-colors"
                                                >
                                                    <FaSignOutAlt className="w-3 h-3" /> EXIT VAULT
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link href="/auth/signin" className="hidden md:block">
                                <Button className="rounded-xl bg-primary text-black hover:opacity-90 font-bold uppercase tracking-widest text-[10px] px-8 h-12 shadow-lg transition-all">
                                    SIGN IN
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] glass-dark-premium backdrop-blur-3xl p-12 flex flex-col items-center justify-center"
                    >
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute top-12 right-12 text-white/40 hover:text-white transition-colors"
                        >
                            <MdClose className="w-10 h-10" />
                        </button>

                        <div className="w-full max-w-4xl space-y-12">
                            <div className="space-y-4 text-center">
                                <span className="text-primary font-black tracking-[0.5em] uppercase text-xs">Search our inventory</span>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="MODEL, BRAND OR CATEGORY..."
                                    className="w-full bg-transparent border-b-2 border-white/10 py-8 text-5xl md:text-7xl font-black text-white uppercase tracking-tighter outline-none focus:border-primary transition-colors placeholder:text-white/10"
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <SearchTrend label="iPhone 16 Pro" />
                                <SearchTrend label="Galaxy S24" />
                                <SearchTrend label="AirPods Pro" />
                                <SearchTrend label="Repair Services" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

function SearchTrend({ label }: { label: string }) {
    return (
        <div className="p-4 border border-white/5 hover:border-primary/30 cursor-pointer group transition-all bg-white/5">
            <p className="text-[10px] font-black tracking-widest text-white/40 group-hover:text-primary uppercase">{label}</p>
        </div>
    )
}
