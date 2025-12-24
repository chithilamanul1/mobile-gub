"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    Settings,
    Globe,
    Shield,
    Bell,
    Server,
    Database,
    Palette,
    Lock
} from "lucide-react"

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        siteName: 'MOBILE HUB',
        territory: 'SRI LANKA',
        systemEmail: 'HQ@MOBILEHUB.LK'
    })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings")
                if (res.ok) {
                    const data = await res.json()
                    // If no data yet, keep defaults
                    if (Object.keys(data).length > 0) {
                        setSettings(prev => ({ ...prev, ...data }))
                    }
                }
            } catch (error) {
                toast.error("Failed to load settings.")
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            })

            if (res.ok) {
                toast.success("Institutional Configuration Updated.")
            } else {
                toast.error("Update failed.")
            }
        } catch (error) {
            toast.error("Network error.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-10 text-white/20 text-xs font-black uppercase tracking-widest animate-pulse">Loading Configuration...</div>

    return (
        <div className="space-y-12">

            {/* Page Header */}
            <div className="border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="w-8 h-[2px] bg-primary" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase">SYSTEM CONFIGURATION</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight uppercase leading-none italic">
                        Command Settings
                    </h1>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                        Configure institutional logistics and system-wide security protocols.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                    <SettingNav label="Institutional Profile" icon={<Globe />} active />
                    <SettingNav label="Security Vault" icon={<Shield />} />
                    <SettingNav label="Notification Stream" icon={<Bell />} />
                    <SettingNav label="Data Integrity" icon={<Database />} />
                    <SettingNav label="Visual Identity" icon={<Palette />} />
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9 space-y-8">

                    {/* General Settings */}
                    <section className="p-10 bg-[#080808] border border-white/5 rounded-[40px] space-y-8">
                        <h3 className="text-[10px] font-black tracking-[0.5em] text-primary uppercase italic">Institutional Identity</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Establishment Name</label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-black uppercase italic outline-none focus:border-primary/20 transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Primary Territory</label>
                                <input
                                    type="text"
                                    value={settings.territory}
                                    onChange={(e) => setSettings({ ...settings, territory: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-black uppercase italic outline-none focus:border-primary/20 transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">System Email</label>
                                <input
                                    type="text"
                                    value={settings.systemEmail}
                                    onChange={(e) => setSettings({ ...settings, systemEmail: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-black uppercase italic outline-none focus:border-primary/20 transition-all"
                                />
                            </div>
                            <div className="space-y-3 flex items-end">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full h-14 bg-primary text-black font-black text-[10px] tracking-widest uppercase rounded-2xl hover:bg-white transition-all shadow-xl shadow-primary/10"
                                >
                                    {saving ? "SAVING..." : "SAVE CONFIGURATION"}
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Advanced Settings */}
                    <section className="p-10 bg-[#080808] border border-white/10 rounded-[40px] border-dashed space-y-6">
                        <div className="flex items-center gap-3">
                            <Lock className="w-4 h-4 text-white/10" />
                            <h3 className="text-[10px] font-black tracking-[0.5em] text-white/20 uppercase italic">Advanced Protocols</h3>
                        </div>
                        <p className="text-[10px] font-medium text-white/10 uppercase leading-relaxed tracking-widest max-w-lg">
                            Institutional data streams and POS registry sync settings are currently controlled via the core infrastructure layer.
                        </p>
                    </section>
                </div>

            </div>

        </div>
    )
}

function SettingNav({ label, icon, active = false }: { label: string, icon: any, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all border ${active
            ? "bg-primary/5 border-primary/20 text-primary"
            : "border-transparent text-white/30 hover:bg-white/5 hover:text-white"
            }`}>
            <span className="text-lg">{icon}</span>
            <span className="text-[10px] font-black tracking-widest uppercase italic">{label}</span>
        </button>
    )
}
