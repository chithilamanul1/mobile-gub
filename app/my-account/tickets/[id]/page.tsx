import { auth } from "@/auth"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import TicketChat from "@/components/support/TicketChat"
import { redirect } from "next/navigation"

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()
    if (!session?.user) redirect("/auth/signin")

    return (
        <div className="bg-white dark:bg-black min-h-screen text-gray-900 dark:text-white pt-32 pb-40">
            <div className="container mx-auto px-6 max-w-4xl space-y-12">

                {/* Back Link */}
                <Link href="/my-account/tickets" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
                    <ArrowLeft className="w-3 h-3" /> Back to Vault
                </Link>

                <TicketChat ticketId={id} />

            </div>
        </div>
    )
}
