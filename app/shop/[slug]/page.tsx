import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { FinancingOptions } from "@/components/shop/FinancingOptions"
import { VisualVariantSelector } from "@/components/shop/VisualVariantSelector"
import { AddToCartButton } from "@/components/shop/AddToCartButton"
import { InstallmentWidget } from "@/components/product/InstallmentWidget"
import { FaShieldAlt, FaBox, FaTruck, FaShoppingCart, FaBolt } from "react-icons/fa"
import { MdVerified } from "react-icons/md"
import { prisma } from "@/lib/prisma"
import Image from "next/image"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const product = await (prisma.product as any).findUnique({ where: { id: slug } })

    if (!product) return { title: "Product Not Found" }

    const title = `${product.brand} ${product.model_name} | Buy Genuine Sri Lanka`
    const description = `Buy genuine ${product.brand} ${product.model_name} in Sri Lanka. Authorized dealer, TRCSL approved assets, 1 year hub warranty, and islandwide delivery. Identification number: ${product.id}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: product.image_url ? [{ url: product.image_url }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: product.image_url ? [product.image_url] : [],
        }
    }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    if (!slug) {
        notFound()
    }

    const product = (await (prisma.product as any).findUnique({
        where: { id: slug },
        include: {
            imeis: {
                where: { status: 'AVAILABLE' }
            }
        }
    })) as any

    if (!product) {
        notFound()
    }

    const isPreOwned = product.description?.toLowerCase().includes('second hand') ||
        product.description?.toLowerCase().includes('pre-owned') ||
        product.model_name.toLowerCase().includes('used')

    return (
        <div className="bg-white dark:bg-black min-h-screen text-gray-900 dark:text-white pt-32 pb-40">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Visual Showcase (Standard/Clean) */}
                    <div className="space-y-8 lg:sticky lg:top-32">
                        <div className="aspect-square relative bg-gray-50 dark:bg-[#050505] rounded-[32px] overflow-hidden p-12 border border-gray-100 dark:border-white/5">
                            {product.image_url ? (
                                <Image
                                    src={product.image_url}
                                    alt={product.model_name}
                                    fill
                                    className="object-contain p-8 drop-shadow-2xl"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-white/5">
                                    <h2 className="text-8xl font-black italic tracking-tighter text-gray-200 dark:text-white/5">PRISTINE</h2>
                                </div>
                            )}

                            {product.is_trcsl_approved && (
                                <div className="absolute top-8 right-8 flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full">
                                    <MdVerified className="text-blue-500" />
                                    <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase">TRCSL COMPLIANT</span>
                                </div>
                            )}
                        </div>

                        {/* Traditional Thumbnails Replacement (Decorative for now) */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5" />
                            ))}
                        </div>
                    </div>

                    {/* Information & Purchase Side */}
                    <div className="space-y-12">
                        <header className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="text-[10px] font-black tracking-widest uppercase">{product.brand}</span>
                                    <div className="h-1 w-1 rounded-full bg-primary" />
                                    <span className="text-[10px] font-black tracking-widest uppercase">OFFICIAL Authorized</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-black tracking-tight uppercase leading-tight">
                                    {product.model_name}
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center gap-6">
                                <span className="text-4xl font-black tracking-tighter">LKR {product.price_lkr.toLocaleString()}</span>
                                <div className="px-3 py-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500 text-[10px] font-black rounded-lg uppercase tracking-widest">
                                    Ready to Ship
                                </div>
                            </div>
                        </header>

                        <div className="space-y-8 py-8 border-y border-gray-100 dark:border-white/5">
                            <p className="text-gray-500 dark:text-white/40 text-lg leading-relaxed font-medium uppercase tracking-tight">
                                {product.description || `Experience the unparalleled power and elegance of the ${product.model_name}. This official authorized unit comes with full Sri Lankan warranty and total peace of mind.`}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <ValueCard icon={<FaShieldAlt />} label="HUB WARRANTY" sub="1 Year Coverage" />
                                <ValueCard icon={<FaTruck />} label="ISLANDWIDE" sub="24-48h Delivery" />
                            </div>
                        </div>

                        {/* Visual Variants & Urgency */}
                        <VisualVariantSelector stock={product.stock_count} />

                        {/* Easy Financing */}
                        <div className="space-y-4">
                            <FinancingOptions price={product.price_lkr} />
                        </div>

                        {/* Conversion Point (Clear & Strong) */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary font-black h-16 rounded-2xl text-sm tracking-widest uppercase transition-all shadow-xl">
                                BUY NOW
                            </Button>
                            <AddToCartButton
                                product={{
                                    id: product.id,
                                    name: product.model_name,
                                    price: product.price_lkr,
                                    image: product.image_url || ""
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function ValueCard({ icon, label, sub }: { icon: any; label: string; sub: string }) {
    return (
        <div className="flex items-center gap-4 py-6 px-6 bg-white dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/5">
            <span className="text-primary text-2xl">{icon}</span>
            <div>
                <p className="text-[10px] font-black tracking-widest text-gray-900 dark:text-white uppercase">{label}</p>
                <p className="text-[10px] font-medium text-gray-400 dark:text-white/40 uppercase">{sub}</p>
            </div>
        </div>
    )
}
