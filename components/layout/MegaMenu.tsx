"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Smartphone, Laptop, Tablet, Headphones, Watch, BatteryCharging, Shield, Zap, Sparkles, Settings } from "lucide-react"

const CATEGORIES = [
    {
        title: "APPLE EXCLUSIVE",
        icon: <Sparkles className="w-4 h-4" />,
        items: [
            { title: "iPhone 16 Pro Max", href: "/shop?brand=Apple", desc: "Titanium. Future. Perfection." },
            { title: "iPhone 16 Series", href: "/shop?brand=Apple", desc: "The official authorized lineup." },
            { title: "Certified Pre-owned", href: "/shop?brand=Apple&category=Pre-owned", desc: "Inspection certified elite units." },
            { title: "AirPods Pro", href: "/shop?category=Accessory", desc: "The sound of pure luxury." }
        ]
    },
    {
        title: "ANDROID FLAGSHIPS",
        icon: <Zap className="w-4 h-4" />,
        items: [
            { title: "Galaxy S24 Ultra", href: "/shop?brand=Samsung", desc: "AI intelligence redefined." },
            { title: "Galaxy Z Fold 6", href: "/shop?brand=Samsung", desc: "The future of folding technology." },
            { title: "Pixel 9 Pro", href: "/shop?brand=Google", desc: "Pure Android. Pure Hub." },
            { title: "S-Tier Pre-owned", href: "/shop?category=Pre-owned", desc: "Curated flagship value." }
        ]
    },
    {
        title: "HUB INSTITUTION",
        icon: <Shield className="w-4 h-4" />,
        items: [
            { title: "TRCSL Verification", href: "/warranty", desc: "Official verification portal." },
            { title: "Express Logistics", href: "/shipping", desc: "Islandwide 24h delivery." },
            { title: "Institutional Warranty", href: "/warranty", desc: "12-month Hub coverage." },
            { title: "Service Center", href: "/repairs", desc: "Advanced technical diagnostics." }
        ]
    }
]

export function MegaMenu() {
    return (
        <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-[11px] font-bold uppercase tracking-widest hover:text-primary focus:bg-transparent data-[state=open]:text-primary transition-all p-0 h-auto">
                        COLLECTIONS
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="grid w-[900px] grid-cols-3 p-10 gap-10 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 shadow-2xl rounded-3xl">
                            {CATEGORIES.map((cat) => (
                                <div key={cat.title} className="space-y-8">
                                    <div className="flex items-center gap-3 text-primary border-b border-gray-50 dark:border-white/5 pb-4">
                                        {cat.icon}
                                        <h3 className="text-[11px] font-black tracking-widest uppercase">{cat.title}</h3>
                                    </div>
                                    <ul className="space-y-6">
                                        {cat.items.map((item) => (
                                            <li key={item.title}>
                                                <Link href={item.href} className="group block space-y-1">
                                                    <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors uppercase tracking-tight">{item.title}</p>
                                                    <p className="text-[10px] text-gray-400 dark:text-white/30 font-medium uppercase tracking-tighter">{item.desc}</p>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/shop?category=Pre-owned" className="text-[11px] font-bold uppercase tracking-widest hover:text-primary transition-colors px-4 py-2 rounded-xl">
                            CERTIFIED PRE-OWNED
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/warranty" className="text-[11px] font-bold uppercase tracking-widest hover:text-primary transition-colors px-4 py-2 rounded-xl">
                            WARRANTY
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
