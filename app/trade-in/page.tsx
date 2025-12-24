import { TradeInForm } from "@/components/trade-in/TradeInForm"
import { Metadata } from "next"
import { Smartphone, RefreshCw, CreditCard, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
    title: "Trade-In & Upgrade | Mobile Hub",
    description: "Exchange your old device for the latest technology. Get a competitive quote instantly.",
}

export default function TradeInPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Hero Section */}
                <div className="text-center space-y-6 mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <RefreshCw className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black tracking-widest text-primary uppercase">Mobile Hub Exchange™</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
                        Upgrade Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Legacy</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Turn your current device into credit towards the latest flagship.
                        Simple process, competitive rates, and instant processing.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Instructions / Value Props */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-8">
                            <StepCard
                                icon={<Smartphone className="w-8 h-8 text-primary" />}
                                number="01"
                                title="Get a Quote"
                                description="Fill out the form with your device details to receive a preliminary offer."
                            />
                            <div className="h-16 w-px bg-gradient-to-b from-primary/50 to-transparent ml-8" />
                            <StepCard
                                icon={<RefreshCw className="w-8 h-8 text-white" />}
                                number="02"
                                title="Verification"
                                description="Bring your device to our store or ship it for a final condition check."
                            />
                            <div className="h-16 w-px bg-gradient-to-b from-white/20 to-transparent ml-8" />
                            <StepCard
                                icon={<CreditCard className="w-8 h-8 text-white" />}
                                number="03"
                                title="Instant Credit"
                                description="Apply the value immediately towards your new purchase or get paid."
                            />
                        </div>

                        <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 space-y-4">
                            <h4 className="text-xl font-bold uppercase tracking-tight">Why Trade-In?</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-gray-400 text-sm">
                                    <ArrowRight className="w-4 h-4 text-primary" />
                                    Highest market value for pristine devices
                                </li>
                                <li className="flex items-center gap-3 text-gray-400 text-sm">
                                    <ArrowRight className="w-4 h-4 text-primary" />
                                    Seamless data transfer assistance
                                </li>
                                <li className="flex items-center gap-3 text-gray-400 text-sm">
                                    <ArrowRight className="w-4 h-4 text-primary" />
                                    Eco-friendly recycling of old tech
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-7">
                        <TradeInForm />
                    </div>
                </div>

            </div>
        </div>
    )
}

function StepCard({ icon, number, title, description }: { icon: any, number: string, title: string, description: string }) {
    return (
        <div className="flex gap-6 relative group">
            <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-500">
                    {icon}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-gray-500">{number}</span>
                </div>
            </div>
            <div className="pt-2">
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    )
}
