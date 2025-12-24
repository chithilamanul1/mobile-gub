"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Save,
    Smartphone,
    ShieldCheck,
    Plus,
    Package
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        brand: '',
        model_name: '',
        price_lkr: 0,
        category: 'SMARTPHONE',
        is_trcsl_approved: false
    })

    const handleSave = async () => {
        if (!formData.brand || !formData.model_name || !formData.price_lkr) {
            toast.error("Please fill all institutional fields.")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                const product = await res.json()
                toast.success("Asset registered in registry.")
                router.push(`/admin/products/${product.id}`)
            } else {
                toast.error("Registry failure.")
            }
        } catch (error) {
            toast.error("Connection lost.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-12 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/admin/products" className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Registry</span>
                </Link>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 text-primary">
                    <Plus className="w-6 h-6" />
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase">Initialize New Asset</span>
                </div>
                <h1 className="text-5xl font-black tracking-tight uppercase leading-none italic">
                    Asset Creation
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                    <Card className="bg-[#080808] border-white/5 rounded-[40px] p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Brand Identity</label>
                                <Input
                                    placeholder="e.g. APPLE"
                                    className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-sm font-black uppercase tracking-widest placeholder:text-white/10 focus:border-primary/40 transition-all"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Model Designation</label>
                                <Input
                                    placeholder="e.g. IPHONE 15 PRO"
                                    className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-sm font-black uppercase tracking-widest placeholder:text-white/10 focus:border-primary/40 transition-all"
                                    value={formData.model_name}
                                    onChange={(e) => setFormData({ ...formData, model_name: e.target.value.toUpperCase() })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Institutional Valuation (LKR)</label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-sm font-black uppercase tracking-widest placeholder:text-white/10 focus:border-primary/40 transition-all"
                                    value={formData.price_lkr}
                                    onChange={(e) => setFormData({ ...formData, price_lkr: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Asset Category</label>
                                <Input
                                    placeholder="e.g. SMARTPHONE"
                                    className="h-16 bg-white/5 border-white/10 rounded-2xl px-6 text-sm font-black uppercase tracking-widest placeholder:text-white/10 focus:border-primary/40 transition-all"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value.toUpperCase() })}
                                />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex items-center gap-4">
                            <div className="flex-1 flex items-center gap-3 p-6 bg-white/5 rounded-3xl border border-white/5">
                                <input
                                    type="checkbox"
                                    id="trcsl"
                                    className="w-5 h-5 accent-primary border-white/10 bg-transparent"
                                    checked={formData.is_trcsl_approved}
                                    onChange={(e) => setFormData({ ...formData, is_trcsl_approved: e.target.checked })}
                                />
                                <label htmlFor="trcsl" className="text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer">
                                    TRCSL INSTITUTIONAL VERIFICATION
                                </label>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="h-16 px-12 bg-primary text-black hover:bg-white rounded-[24px] font-black text-[12px] tracking-[0.4em] uppercase shadow-2xl shadow-primary/20 transition-all flex items-center gap-4"
                        >
                            {loading ? "COMMITTING..." : (
                                <>
                                    <Save className="w-5 h-5" />
                                    REGISTER ASSET
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <Card className="bg-primary border-transparent rounded-[40px] p-10 text-black">
                        <div className="space-y-6">
                            <div className="h-12 w-12 rounded-2xl bg-black/10 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-tight leading-none">Security Registry</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-60">
                                This asset will be registered in the master inventory vault. Ensure all compliance checks are performed before final registry commitment.
                            </p>
                        </div>
                    </Card>

                    <Card className="bg-[#080808] border-white/5 rounded-[40px] p-10 space-y-6">
                        <div className="flex items-center gap-3 text-white/20">
                            <Package className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
                        </div>
                        <ul className="space-y-4">
                            <li className="text-[9px] font-bold text-white/40 uppercase tracking-widest flex gap-3">
                                <span className="text-primary">•</span> Brand must match official TRCSL registry.
                            </li>
                            <li className="text-[9px] font-bold text-white/40 uppercase tracking-widest flex gap-3">
                                <span className="text-primary">•</span> Valuation should reflect current market rates.
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    )
}
