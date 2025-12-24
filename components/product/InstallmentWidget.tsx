"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { CreditCard } from "lucide-react"

interface InstallmentWidgetProps {
    price: number
}

export function InstallmentWidget({ price }: InstallmentWidgetProps) {
    // Real formula: Price / Months. Some banks might add handling fees, but for premium promo we assume 0% or low fee.
    // Adding small handling fee logic for realism.
    const calculateMonthly = (months: number, processingRate: number = 0) => {
        const total = price + (price * processingRate)
        return (total / months).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    const banks = [
        {
            name: "Sampath Bank",
            color: "text-orange-500",
            plans: [
                { months: 12, rate: 0.0, label: "0% Interest" },
                { months: 24, rate: 0.0, label: "0% Interest" }
            ]
        },
        {
            name: "Commercial Bank",
            color: "text-blue-500",
            plans: [
                { months: 12, rate: 0.01, label: "1% Handling" },
                { months: 24, rate: 0.025, label: "2.5% Handling" }
            ]
        },
        {
            name: "HNB",
            color: "text-yellow-600",
            plans: [
                { months: 12, rate: 0.0, label: "0% Interest" },
                { months: 24, rate: 0.015, label: "1.5% Handling" }
            ]
        },
    ]

    return (
        <div className="w-full bg-accent/20 rounded-xl p-3 border border-white/5">
            <h3 className="text-xs font-semibold mb-2 flex items-center text-muted-foreground uppercase tracking-wider">
                <CreditCard className="w-3 h-3 mr-1" /> Monthly Installments
            </h3>
            <Accordion type="single" collapsible className="w-full">
                {banks.map((bank) => (
                    <AccordionItem key={bank.name} value={bank.name} className="border-b-white/5">
                        <AccordionTrigger className="text-sm py-2 hover:no-underline">
                            <span className={bank.color}>{bank.name}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-1">
                                {bank.plans.map((plan) => (
                                    <div key={plan.months} className="flex justify-between items-center text-xs p-2 rounded bg-background/50">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{plan.months} Months</span>
                                            <span className="text-[10px] text-muted-foreground">{plan.label}</span>
                                        </div>
                                        <span className="font-bold text-foreground">
                                            Rs. {calculateMonthly(plan.months, plan.rate)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
