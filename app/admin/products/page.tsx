import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    TrendingUp,
    AlertTriangle,
    Smartphone,
    Package,
    Upload
} from "lucide-react"
import Link from "next/link"

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { updatedAt: 'desc' }
    })

    const lowStockCount = products.filter((p: any) => p.stock_count < 3).length

    return (
        <div className="space-y-12">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="w-8 h-[2px] bg-primary" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase">REGISTRY CONTROL</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight uppercase leading-none italic">
                        Inventory Hub
                    </h1>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                        Centralized management for flagship devices and accessories.
                    </p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <Link href="/admin/products/new" className="flex-1">
                        <Button className="w-full h-16 bg-primary text-black hover:bg-white rounded-2xl px-10 font-black text-[10px] tracking-[0.3em] uppercase shadow-2xl shadow-primary/20 transition-all">
                            <Plus className="w-4 h-4 mr-2" /> ADD NEW ASSET
                        </Button>
                    </Link>
                    <Link href="/admin/products/import">
                        <Button variant="outline" className="h-16 rounded-2xl border-white/5 px-8 font-black text-[10px] tracking-[0.3em] uppercase hover:bg-white/5">
                            <Upload className="w-4 h-4 mr-2" /> IMPORT POS
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InventoryStat label="Total Assets" value={products.length.toString()} />
                <InventoryStat label="Active Stock" value={products.reduce((acc: any, p: any) => acc + p.stock_count, 0).toString()} />
                <InventoryStat
                    label="Low Stock Alerts"
                    value={lowStockCount.toString()}
                    color={lowStockCount > 0 ? "text-red-500" : "text-white/20"}
                    icon={lowStockCount > 0 ? <AlertTriangle className="w-4 h-4 animate-pulse" /> : null}
                />
            </div>

            {/* Product Table */}
            <div className="bg-[#080808] border border-white/5 rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="SEARCH REGISTRY..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black text-white placeholder:text-white/10 outline-none focus:border-primary/30 transition-all uppercase tracking-widest"
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="h-14 rounded-2xl border-white/5 text-[10px] font-black uppercase tracking-widest px-8">
                            <Filter className="w-4 h-4 mr-2" /> FILTER
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">RESOURCE</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">VALUATION</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">STOCK</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">STATUS</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((product: any) => (
                                <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-8">
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/5 overflow-hidden group-hover:border-primary/20 transition-all flex items-center justify-center">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Smartphone className="w-6 h-6 text-white/10" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-primary uppercase mb-1 tracking-widest">{product.brand}</p>
                                                <h3 className="text-sm font-black uppercase tracking-tight italic">{product.model_name}</h3>
                                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">{product.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black italic">₨ {product.price_lkr.toLocaleString()}</p>
                                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Base Rate</p>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-black ${product.stock_count < 3 ? 'text-red-500' : 'text-white'}`}>
                                                {product.stock_count}
                                            </span>
                                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic">units</span>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${product.is_trcsl_approved ? 'bg-primary' : 'bg-red-500'}`} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">
                                                {product.is_trcsl_approved ? "TRCSL VERIFIED" : "PENDING"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/products/${product.id}`}>
                                                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {products.length === 0 && (
                    <div className="p-32 text-center space-y-6">
                        <Package className="w-16 h-16 mx-auto text-white/5" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Institutional Registry Empty</p>
                        <Link href="/admin/products/new">
                            <Button variant="outline" className="h-14 rounded-2xl border-white/5 px-8 text-[10px] font-black uppercase tracking-widest">Initialize Assets</Button>
                        </Link>
                    </div>
                )}
            </div>

        </div>
    )
}

function InventoryStat({ label, value, color = "text-white", icon = null }: { label: string, value: string, color?: string, icon?: any }) {
    return (
        <div className="p-10 bg-[#080808] border border-white/5 rounded-[40px] space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">{label}</p>
                {icon}
            </div>
            <p className={`text-5xl font-black tracking-tighter italic ${color}`}>{value}</p>
        </div>
    )
}
