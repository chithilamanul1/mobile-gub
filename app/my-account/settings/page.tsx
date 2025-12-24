import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Shield, Bell, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default async function SettingsPage() {
    const session = await auth()

    return (
        <div className="bg-white dark:bg-black min-h-screen text-gray-900 dark:text-white pt-32 pb-40">
            <div className="container mx-auto px-6 max-w-4xl space-y-12">

                {/* Back Link */}
                <Link href="/my-account" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
                    <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                </Link>

                <div className="space-y-4">
                    <h1 className="text-5xl font-black tracking-tight uppercase leading-none">Vault Settings</h1>
                    <p className="text-gray-400 dark:text-white/30 text-xs font-bold uppercase tracking-widest">
                        Manage your security keys and institutional identity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Settings Nav */}
                    <aside className="space-y-2">
                        <SettingsTab icon={<User />} label="IDENTITY" active />
                        <SettingsTab icon={<Shield />} label="SECURITY" />
                        <SettingsTab icon={<Bell />} label="ALERTS" />
                    </aside>

                    {/* Main Settings Form */}
                    <div className="md:col-span-2 space-y-12">
                        <section className="space-y-8 p-10 bg-gray-50 dark:bg-[#050505] rounded-[40px] border border-gray-100 dark:border-white/5">
                            <h3 className="text-sm font-black tracking-widest uppercase text-primary">Institutional Identity</h3>

                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Display Name</label>
                                    <Input
                                        defaultValue={session?.user?.name || ""}
                                        className="h-14 bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 rounded-2xl px-6 text-xs font-bold uppercase tracking-widest"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hub Email (Locked)</label>
                                    <Input
                                        defaultValue={session?.user?.email || ""}
                                        disabled
                                        className="h-14 bg-gray-100 dark:bg-white/2 border-gray-100 dark:border-white/5 rounded-2xl px-6 text-xs font-bold uppercase tracking-widest opacity-50"
                                    />
                                </div>

                                <div className="pt-4">
                                    <Button className="h-14 bg-black dark:bg-white text-white dark:text-black hover:bg-primary rounded-2xl px-10 font-black text-xs tracking-widest uppercase group transition-all">
                                        <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> UPDATE IDENTITY
                                    </Button>
                                </div>
                            </form>
                        </section>

                        <section className="p-10 bg-primary/5 border border-primary/20 rounded-[40px] space-y-4">
                            <div className="flex gap-4 text-primary">
                                <Shield className="text-2xl shrink-0" />
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest">Enhanced Security</h4>
                                    <p className="text-[10px] font-medium text-gray-900 dark:text-white/60 uppercase leading-relaxed mt-2">
                                        Your account is protected by Hub Institutional Security. Password changes require two-factor technical verification.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    )
}

function SettingsTab({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all border border-transparent ${active
                ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                : "text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary"
            }`}>
            <span className="text-xl">{icon}</span>
            <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
        </button>
    )
}
