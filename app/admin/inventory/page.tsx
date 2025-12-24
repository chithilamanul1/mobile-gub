"use client"

import { useState, useEffect } from "react"
import {
    Plus,
    Search,
    Filter,
    Trash2,
    CheckCircle2,
    XCircle,
    Barcode,
    ArrowLeft,
    TrendingUp,
    ShieldCheck,
    Package,
    Smartphone
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BulkIMEIImporter } from "@/components/admin/BulkIMEIImporter"
import { toast } from "sonner"

export default function InventoryPage() {
    const [imeis, setImeis] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filterProduct, setFilterProduct] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')
    const [showAddForm, setShowAddForm] = useState(false)

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setLoading(true)
                const params = new URLSearchParams()
                if (filterProduct !== 'all') params.append('productId', filterProduct)
                if (filterStatus !== 'all') params.append('status', filterStatus)

                const res = await fetch(`/api/admin/inventory?${params}`)
                const data = await res.json()
                setImeis(data.imeis || [])
                setProducts(data.products || [])
            } catch (error) {
                toast.error("Registry connection lost.")
            } finally {
                setLoading(false)
            }
        }
        fetchInventory()
    }, [filterProduct, filterStatus])

    const deleteIMEI = async (id: string) => {
        if (!confirm('Institutional Action: Permanently delete this IMEI registry?')) return

        try {
            const res = await fetch(`/api/admin/inventory/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success("Asset removed from registry.")
                setImeis(prev => prev.filter(i => i.id !== id))
            } else {
                toast.error("Deletion failure.")
            }
        } catch (error) {
            toast.error("Registry unstable.")
        }
    }

    const toggleStatus = async (imei: any) => {
        const newStatus = imei.status === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE'
        try {
            const res = await fetch(`/api/admin/inventory/${imei.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                toast.success(`Asset status updated to ${newStatus}`)
                setImeis(prev => prev.map(i => i.id === imei.id ? { ...i, status: newStatus } : i))
            }
        } catch (error) {
            toast.error("Update failure.")
        }
    }

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="w-8 h-[2px] bg-primary" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase">ASSET TRACKING</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight uppercase leading-none italic">
                        Inventory Vault
                    </h1>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                        Manage individual device registries and TRCSL certification status.
                    </p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <Button
                        onClick={() => setShowAddForm(true)}
                        className="h-16 bg-primary text-black hover:bg-white rounded-2xl px-10 font-black text-[10px] tracking-[0.3em] uppercase transition-all shadow-2xl shadow-primary/20"
                    >
                        <Plus className="w-4 h-4 mr-2" /> REGISTER NEW IMEI
                    </Button>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total IMEIs" value={imeis.length.toString()} icon={<Barcode className="w-4 h-4" />} />
                <StatCard label="Available Assets" value={imeis.filter(i => i.status === 'AVAILABLE').length.toString()} color="text-green-500" />
                <StatCard label="Institutional Sales" value={imeis.filter(i => i.status === 'SOLD').length.toString()} color="text-primary" />
                <StatCard label="TRCSL Certified" value={imeis.filter(i => i.is_registered).length.toString()} color="text-blue-500" icon={<ShieldCheck className="w-4 h-4" />} />
            </div>

            {/* Bulk Actions */}
            <div className="p-8 bg-[#080808] border border-white/5 rounded-[40px] space-y-6">
                <div className="flex items-center gap-3 text-primary opacity-40">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Institutional Bulk Import</span>
                </div>
                <BulkIMEIImporter onSuccess={() => window.location.reload()} />
            </div>

            {/* Registry Table */}
            <div className="bg-[#080808] border border-white/5 rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                    <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 scrollbar-hide">
                        <select
                            value={filterProduct}
                            onChange={(e) => setFilterProduct(e.target.value)}
                            className="h-12 bg-white/5 border border-white/5 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest text-white/40 focus:text-white transition-colors outline-none"
                        >
                            <option value="all">ALL ASSET MODELS</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.brand} {p.model_name}</option>
                            ))}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="h-12 bg-white/5 border border-white/5 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest text-white/40 focus:text-white transition-colors outline-none"
                        >
                            <option value="all">ALL STATUSES</option>
                            <option value="AVAILABLE">AVAILABLE</option>
                            <option value="SOLD">SOLD</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">SERIAL / IMEI</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">MODEL IDENTITY</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">STATUS</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">TRCSL</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {imeis.map((imei) => (
                                <tr key={imei.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <Barcode className="w-4 h-4 text-white/10" />
                                            <span className="text-sm font-black italic tracking-tighter text-white/80">{imei.number}</span>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">{imei.product.brand}</p>
                                            <h4 className="text-[12px] font-black uppercase italic tracking-tight">{imei.product.model_name}</h4>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <button onClick={() => toggleStatus(imei)}>
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border transition-all ${imei.status === 'AVAILABLE' ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20" : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                                                }`}>
                                                {imei.status}
                                            </span>
                                        </button>
                                    </td>
                                    <td className="p-8">
                                        <div className={`flex items-center gap-2 ${imei.is_registered ? "text-blue-500" : "text-white/10"}`}>
                                            <ShieldCheck className="w-3 h-3" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{imei.is_registered ? "CERTIFIED" : "PENDING"}</span>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <Button
                                            variant="ghost"
                                            className="h-10 w-10 text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all p-0"
                                            onClick={() => deleteIMEI(imei.id)}
                                            disabled={imei.status === 'SOLD'}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {imeis.length === 0 && (
                    <div className="p-32 text-center space-y-6">
                        <Package className="w-16 h-16 mx-auto text-white/5" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Institutional Registry Empty</p>
                    </div>
                )}
            </div>

            {/* Add IMEI Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-8" onClick={() => setShowAddForm(false)}>
                    <Card className="bg-[#050505] border border-white/10 rounded-[40px] max-w-xl w-full p-10 space-y-10 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter">Register New Asset</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Initialize device serial in the master registry.</p>
                        </div>

                        <IMEIForm products={products} onSuccess={() => { setShowAddForm(false); window.location.reload(); }} />
                    </Card>
                </div>
            )}
        </div>
    )
}

function StatCard({ label, value, color = "text-white", icon = null }: any) {
    return (
        <div className="p-10 bg-[#080808] border border-white/5 rounded-[40px] space-y-4 group hover:border-white/10 transition-all">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">{label}</p>
                <div className="text-primary opacity-40 group-hover:scale-110 transition-transform">{icon}</div>
            </div>
            <p className={`text-5xl font-black tracking-tighter italic ${color}`}>{value}</p>
        </div>
    )
}

function IMEIForm({ products, onSuccess }: any) {
    const [formData, setFormData] = useState({ number: '', productId: '', is_registered: true })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.number.length !== 15) {
            toast.error("Institutional Error: IMEI must be exactly 15 digits.")
            return
        }
        setLoading(true)
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                toast.success("Institutional registry synchronized.")
                onSuccess()
            } else {
                toast.error("Registry collision detected.")
            }
        } catch (error) { toast.error("Connection failed.") }
        finally { setLoading(false) }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 text-left">
            <div className="space-y-3">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Serial Identifier (IMEI)</label>
                <Input
                    placeholder="358128870236XXX"
                    className="h-16 bg-white/5 border-white/5 rounded-2xl px-6 font-black tracking-[0.2em] text-primary placeholder:text-white/10"
                    maxLength={15}
                    value={formData.number}
                    onChange={e => setFormData({ ...formData, number: e.target.value.replace(/\D/g, '') })}
                />
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Asset Model</label>
                <select
                    className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white outline-none"
                    value={formData.productId}
                    onChange={e => setFormData({ ...formData, productId: e.target.value })}
                    required
                >
                    <option value="">Select Asset from Registry...</option>
                    {products.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.brand} {p.model_name}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                <input
                    type="checkbox"
                    id="trcsl-check"
                    checked={formData.is_registered}
                    onChange={e => setFormData({ ...formData, is_registered: e.target.checked })}
                    className="w-5 h-5 accent-primary"
                />
                <label htmlFor="trcsl-check" className="text-[10px] font-black tracking-widest uppercase">Certified for Institutional Allocation</label>
            </div>
            <Button className="w-full h-16 bg-primary text-black font-black uppercase tracking-widest rounded-2xl">
                {loading ? "COMMITTING..." : "INITIALIZE SERIAL"}
            </Button>
        </form>
    )
}
