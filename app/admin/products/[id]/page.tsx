"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft,
    Save,
    Smartphone,
    ShieldCheck,
    Trash2,
    Eye,
    TrendingUp,
    Package,
    Image as ImageIcon
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { toast } from "sonner"

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const productId = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        brand: '',
        model_name: '',
        price_lkr: 0,
        stock_count: 0,
        is_trcsl_approved: false,
        category: '',
        image_url: ''
    })

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/admin/products/${productId}`)
                const data = await res.json()
                setFormData({
                    brand: data.brand,
                    model_name: data.model_name,
                    price_lkr: data.price_lkr,
                    stock_count: data.stock_count,
                    is_trcsl_approved: data.is_trcsl_approved,
                    category: data.category || 'SMARTPHONE',
                    image_url: data.image_url
                })
            } catch (error) {
                toast.error("Registry connection lost.")
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [productId])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                toast.success("Registry updated successfully.")
                router.refresh()
            } else {
                toast.error("Update failure.")
            }
        } catch (error) {
            toast.error("Network instability.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 animate-pulse">Syncing with Registry...</span>
        </div>
    )

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/admin/products" className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="h-12 w-12 rounded-xl text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all p-0">
                        <Trash2 className="w-5 h-5" />
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-12 px-8 bg-primary text-black hover:bg-white rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all flex items-center gap-3"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "SAVING..." : "COMMIT CHANGES"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-10">
                    {/* Hero Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <Smartphone className="w-5 h-5" />
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase">Asset Intelligence</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight uppercase leading-none italic">
                            {formData.brand} {formData.model_name}
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20">IDENTIFICATION</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Brand</label>
                                    <Input
                                        className="h-14 bg-[#080808] border-white/5 rounded-2xl px-6 text-xs font-black uppercase"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Model Name</label>
                                    <Input
                                        className="h-14 bg-[#080808] border-white/5 rounded-2xl px-6 text-xs font-black uppercase"
                                        value={formData.model_name}
                                        onChange={(e) => setFormData({ ...formData, model_name: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20">VALUATION & STOCK</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Core Valuation (LKR)</label>
                                    <Input
                                        type="number"
                                        className="h-14 bg-[#080808] border-white/5 rounded-2xl px-6 text-xs font-black uppercase text-primary"
                                        value={formData.price_lkr}
                                        onChange={(e) => setFormData({ ...formData, price_lkr: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Current Inventory</label>
                                    <div className="h-14 bg-[#080808] border-white/5 rounded-2xl px-6 flex items-center justify-between">
                                        <span className="text-xs font-black uppercase">{formData.stock_count} UNITS</span>
                                        <Link href={`/admin/inventory?productId=${productId}`} className="text-[8px] font-black text-primary uppercase tracking-widest hover:underline italic">Manage IMEIs</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <ShieldCheck className={`w-8 h-8 ${formData.is_trcsl_approved ? "text-primary" : "text-white/10"}`} />
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest italic">TRCSL Institutional Status</h4>
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Verification across regional hubs.</p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className="w-6 h-6 accent-primary"
                            checked={formData.is_trcsl_approved}
                            onChange={(e) => setFormData({ ...formData, is_trcsl_approved: e.target.checked })}
                        />
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Visual Asset */}
                    <Card className="bg-[#080808] border-white/5 rounded-[40px] overflow-hidden p-8 space-y-6">
                        <div className="flex items-center gap-3 text-white/20">
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Visual Asset</span>
                        </div>
                        <ImageUploader
                            productId={productId}
                            currentImage={formData.image_url}
                            onUploadSuccess={() => {
                                router.refresh()
                                // Re-fetch to get updated main image
                                fetch(`/api/admin/products/${productId}`)
                                    .then(res => res.json())
                                    .then(data => setFormData(prev => ({ ...prev, image_url: data.image_url })))
                            }}
                        />
                    </Card>

                    {/* Meta Status */}
                    <Card className="bg-[#080808] border-white/5 rounded-[40px] p-8 space-y-6">
                        <div className="flex items-center gap-3 text-white/20">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Asset Analytics</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Resource Wait</span>
                                <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Minimal</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Registry Health</span>
                                <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Optimal</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
