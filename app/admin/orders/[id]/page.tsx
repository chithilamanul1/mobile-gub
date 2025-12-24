import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import {
    Clock,
    User,
    CreditCard,
    Truck,
    Smartphone,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Package
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default async function AdminOrderDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: true,
            items: {
                include: { product: true }
            }
        }
    })

    if (!order) {
        notFound()
    }

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/admin/orders" className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Registry</span>
                </Link>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-12 rounded-xl border-white/5 text-[10px] font-black uppercase tracking-widest px-8">UPDATE STATUS</Button>
                    <Button className="h-12 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest px-8">PRINT INVOICE</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-10">
                    {/* Hero Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="w-8 h-[2px] bg-primary" />
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase">TRANSACTION #{order.id.slice(-8)}</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight uppercase italic flex items-center gap-4">
                            Asset Allocation
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border ${order.status === "COMPLETED" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                order.status === "PROCESSING" ? "bg-primary/10 text-primary border-primary/20" :
                                    "bg-white/5 text-white/40 border-white/5"
                                }`}>
                                {order.status}
                            </span>
                        </h1>
                    </div>

                    {/* Items List */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20">MANIFESTED ASSETS</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="p-8 bg-[#080808] border border-white/5 rounded-[32px] flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                                            <Smartphone className="w-8 h-8 text-white/10" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{item.product.brand}</p>
                                            <h4 className="text-lg font-black uppercase italic tracking-tight">{item.product.model_name}</h4>
                                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">QTY: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black italic">₨ {item.price_at_order.toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">Unit Valuation</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Client Context */}
                    <Card className="bg-[#080808] border-white/5 rounded-[40px] overflow-hidden p-8 space-y-8">
                        <div>
                            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-primary mb-6">CLIENT IDENTITY</h3>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                    <User className="w-6 h-6 text-white/40" />
                                </div>
                                <div>
                                    <p className="text-sm font-black uppercase tracking-tight italic">{order.user.name || "Legacy Client"}</p>
                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{order.user.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">PAYMENT METHOD</span>
                                <span className="text-[9px] font-bold text-white uppercase">{(order as any).payment_method || "INSTITUTIONAL"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">SHIPPING</span>
                                <span className="text-[9px] font-bold text-white uppercase truncate max-w-[150px]">{(order as any).shipping_address || "HUB PICKUP"}</span>
                            </div>
                            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">TOTAL VALUE</span>
                                <span className="text-xl font-black italic text-primary">₨ {order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Shipping Context */}
                    <Card className="bg-[#080808] border-white/5 rounded-[40px] p-8 space-y-4">
                        <div className="flex items-center gap-2 text-white/40 mb-4">
                            <Truck className="w-4 h-4" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Allocation Logic</h4>
                        </div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                            Assets are verified for TRCSL compliance before final regional allocation.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}
