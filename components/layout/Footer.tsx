"use client"

import Link from "next/link"
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaTiktok } from "react-icons/fa"
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md"
import { SiVisa, SiMastercard, SiApplepay, SiGooglepay } from "react-icons/si"
import { usePathname } from "next/navigation"

export function Footer() {
    const pathname = usePathname()

    if (pathname?.startsWith("/admin")) return null
    return (
        <footer className="bg-surface text-foreground py-24 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16">

                    {/* Brand Section */}
                    <div className="md:col-span-5 space-y-8">
                        <img src="/logo.png" alt="Mobile Hub" className="h-12 w-auto object-contain" />
                        <p className="text-white/40 text-sm max-w-sm leading-relaxed font-light uppercase tracking-widest">
                            Sri Lanka's premier destination for luxury mobile technology and official authorized genuine devices. Experience technical excellence with every purchase.
                        </p>
                        <div className="flex gap-6">
                            <SocialLink icon={<FaFacebook />} href="javascript:void(0)" />
                            <SocialLink icon={<FaInstagram />} href="javascript:void(0)" />
                            <SocialLink icon={<FaTiktok />} href="javascript:void(0)" />
                            <SocialLink icon={<FaYoutube />} href="javascript:void(0)" />
                        </div>
                    </div>

                    {/* Links Matrix */}
                    <div className="md:col-span-2 space-y-6">
                        <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">COLLECTIONS</h3>
                        <ul className="space-y-4">
                            <FooterLink href="/shop?brand=Apple">Apple iPhone</FooterLink>
                            <FooterLink href="/shop?brand=Samsung">Samsung Galaxy</FooterLink>
                            <FooterLink href="/shop?brand=Xiaomi">Xiaomi Series</FooterLink>
                            <FooterLink href="/shop?category=Audio">Accessories</FooterLink>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">RESOURCES</h3>
                        <ul className="space-y-4">
                            <FooterLink href="/repairs">Repair Center</FooterLink>
                            <FooterLink href="/warranty">TRCSL Check</FooterLink>
                            <FooterLink href="/contact">Store Locator</FooterLink>
                            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="md:col-span-3 space-y-6">
                        <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">CONTACT US</h3>
                        <div className="space-y-4 text-xs font-bold tracking-widest text-white/60">
                            <div className="flex items-start gap-4">
                                <MdLocationOn className="text-primary text-lg" />
                                <a
                                    href="https://www.google.com/maps/place/Mobile+hub/@7.1318255,79.8781267,17z/data=!3m1!4b1!4m6!3m5!1s0x3ae2f100437b8263:0xe2c390ad70acedcc!8m2!3d7.1318202!4d79.8827401"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    NO.484/1 KOTUGODA RD,<br />SEEDUWA, SRI LANKA
                                </a>
                            </div>
                            <div className="flex items-center gap-4">
                                <MdPhone className="text-primary text-lg" />
                                <span>+94 76 882 5485</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <MdEmail className="text-primary text-lg" />
                                <span>SUPPORT@MOBILEHUB.LK</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Strip */}
                <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <p className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">
                            © 2025 MOBILE HUB. IDENTIFY THE DIFFERENCE.
                        </p>
                        <p className="text-[9px] font-bold tracking-[0.2em] text-white/10 uppercase">
                            PRECISION CRAFTED BY <a href="https://seranex.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-colors">CHITHILA MANUL</a> / SERANEX™
                        </p>
                    </div>
                    <div className="flex items-center gap-8 opacity-20 grayscale">
                        <SiVisa className="text-4xl" />
                        <SiMastercard className="text-4xl" />
                        <SiApplepay className="text-4xl" />
                        <SiGooglepay className="text-4xl" />
                        <div className="text-[10px] font-black">KOKO</div>
                        <div className="text-[10px] font-black">MINTPAY</div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

function SocialLink({ icon, href }: { icon: any; href: string }) {
    return (
        <a href={href} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary transition-all duration-300">
            {icon}
        </a>
    )
}

function FooterLink({ children, href }: { children: React.ReactNode; href: string }) {
    return (
        <li>
            <Link href={href} className="text-[10px] font-black tracking-widest text-white/40 hover:text-primary transition-colors uppercase italic">
                {children}
            </Link>
        </li>
    )
}
