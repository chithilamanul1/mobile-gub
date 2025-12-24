import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product/ProductCard"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaShieldAlt } from "react-icons/fa"

export const metadata: Metadata = {
    title: "The Vault | Authorized Mobile Hardware Sri Lanka",
    description: "Browse our master registry of authorized genuine mobile devices. Apple, Samsung, and Xiaomi assets, TRCSL certified with institutional warranty.",
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<any> }) {
    const sParams = await searchParams
    const brand = sParams.brand
    const category = sParams.category
    const sort = sParams.sort || 'desc'

    const products = (await (prisma.product as any).findMany({
        where: {
            brand: brand ? brand : undefined,
            category: category ? category : undefined,
        },
        orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
    })) as any[]

    const allBrands = (await (prisma.product as any).groupBy({ by: ['brand'] })) as any[]
    const allCategories = (await (prisma.product as any).groupBy({ by: ['category'] })) as any[]

    return (
        <div className="bg-white dark:bg-black min-h-screen text-gray-900 dark:text-white pt-32 pb-24">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Clean Sidebar */}
                    <aside className="w-full lg:w-64 space-y-12 h-fit lg:sticky lg:top-32">
                        <section className="space-y-6">
                            <h3 className="text-xs font-black tracking-widest uppercase text-gray-400">Collections</h3>
                            <div className="flex flex-col gap-2">
                                <FilterLink href="/shop" active={!brand && !category}>ALL PRODUCTS</FilterLink>
                                {allBrands.map((b) => (
                                    <FilterLink
                                        key={b.brand}
                                        href={`/shop?brand=${b.brand}`}
                                        active={brand === b.brand}
                                    >
                                        {b.brand}
                                    </FilterLink>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-xs font-black tracking-widest uppercase text-gray-400">Inventory Status</h3>
                            <div className="flex flex-col gap-2">
                                {allCategories.map((c) => (
                                    <FilterLink
                                        key={c.category}
                                        href={`/shop?category=${c.category}`}
                                        active={category === c.category}
                                    >
                                        {c.category}
                                    </FilterLink>
                                ))}
                            </div>
                        </section>

                        <section className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-4">
                            <FaShieldAlt className="text-primary text-2xl" />
                            <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed">
                                All our devices are technical verified & TRCSL certified.
                            </p>
                        </section>
                    </aside>

                    {/* Main Shop View */}
                    <main className="flex-1 space-y-12">
                        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-white/5 pb-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-[2px] bg-primary" />
                                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-primary">AUTHORIZED HUB</span>
                                </div>
                                <h1 className="text-5xl font-black tracking-tight uppercase leading-none">
                                    {brand || category || "THE VAULT"}
                                </h1>
                            </div>

                            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Showing {products.length} Results</span>
                                <div className="h-4 w-[1px] bg-gray-200 dark:bg-white/10" />
                                <select className="bg-transparent outline-none focus:text-primary transition-colors cursor-pointer">
                                    <option>LATEST FIRST</option>
                                    <option>PRICE: LOW TO HIGH</option>
                                    <option>PRICE: HIGH TO LOW</option>
                                </select>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {products.length > 0 ? (
                                products.map((p) => (
                                    <ProductCard
                                        key={p.id}
                                        id={p.id}
                                        brand={p.brand}
                                        modelName={p.model_name}
                                        price={p.price_lkr}
                                        stock={p.stock_count}
                                        image={p.image_url || undefined}
                                        isTrcslApproved={p.is_trcsl_approved}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-32 text-center bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                                    <p className="text-gray-400 uppercase tracking-[0.5em] font-black text-xs animate-pulse">
                                        Inventory Synchronizing...
                                    </p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

function FilterLink({ children, href, active }: { children: React.ReactNode, href: string, active: boolean }) {
    return (
        <Link
            href={href}
            className={`px-4 py-3 text-[10px] font-bold tracking-[0.1em] uppercase transition-all rounded-xl border border-transparent ${active
                ? "bg-black dark:bg-white text-white dark:text-black shadow-lg translate-x-1"
                : "text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary"
                }`}
        >
            {children}
        </Link>
    )
}
