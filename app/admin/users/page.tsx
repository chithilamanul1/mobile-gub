import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
    Users,
    Shield,
    Mail,
    MoreHorizontal,
    UserPlus,
    Lock,
    Unlock,
    Search,
    ArrowUpRight
} from "lucide-react"
import Link from "next/link"

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    })

    const adminCount = users.filter((u: any) => u.role === "ADMIN" || u.role === "OWNER").length

    return (
        <div className="space-y-12">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="w-8 h-[2px] bg-primary" />
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase">PERSONNEL CONTROL</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight uppercase leading-none italic">
                        User Directory
                    </h1>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                        Manage institutional access and secure personnel registries.
                    </p>
                </div>

                <Button className="h-16 bg-white/5 text-white hover:bg-white/10 rounded-2xl px-10 font-black text-[10px] tracking-[0.3em] uppercase transition-all border border-white/10">
                    <UserPlus className="w-4 h-4 mr-2" /> INVITE PERSONNEL
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UserStat label="Total Registry" value={users.length.toString()} icon={<Users className="w-4 h-4" />} />
                <UserStat label="Admin Personnel" value={adminCount.toString()} color="text-primary" icon={<Shield className="w-4 h-4" />} />
            </div>

            {/* User Registry */}
            <div className="bg-[#080808] border border-white/5 rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-white/5">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="FIND IDENTIFIER..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black text-white placeholder:text-white/10 outline-none focus:border-primary/30 transition-all uppercase tracking-widest"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">IDENTITY</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">AUTHORIZATION</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">COMMUNICATION</th>
                                <th className="p-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-right">SECURITY</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user: any) => (
                                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 overflow-hidden border border-white/5 group-hover:border-primary/20 transition-all">
                                                {user.image ? (
                                                    <img src={user.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-[10px] font-black uppercase tracking-tighter text-white/20">
                                                        {user.name?.[0] || "?"}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-tight italic">{user.name || "Anonymous Client"}</p>
                                                <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest mt-0.5">{user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border ${(user as any).role === 'OWNER' ? "bg-primary text-black border-primary" :
                                            (user as any).role === 'ADMIN' ? "bg-white/10 text-white border-white/10" :
                                                "bg-white/5 text-white/20 border-white/5"
                                            }`}>
                                            {(user as any).role || "USER"}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-2 text-white/40">
                                            <Mail className="w-3 h-3" />
                                            <p className="text-[10px] font-bold lowercase tracking-normal">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <Link href={`/admin/users/${user.id}`}>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-white/10 hover:text-primary hover:bg-white/5 transition-all">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

function UserStat({ label, value, color = "text-white", icon = null }: { label: string, value: string, color?: string, icon?: any }) {
    return (
        <div className="p-10 bg-[#080808] border border-white/5 rounded-[40px] space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">{label}</p>
                <div className="text-primary opacity-40">{icon}</div>
            </div>
            <p className={`text-5xl font-black tracking-tighter italic ${color}`}>{value}</p>
        </div>
    )
}
