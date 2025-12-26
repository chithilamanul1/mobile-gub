"use client"

import { useState } from "react"
import { FaTruck, FaMapMarkerAlt } from "react-icons/fa"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const SRI_LANKAN_DISTRICTS = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Galle", "Matara", "Kurunegala", "Anuradhapura",
    "Jaffna", "Batticaloa", "Trincomalee", "Badulla", "Nuwara Eliya", "Ratnapura", "Kegalle",
    "Matale", "Puttalam", "Ampara", "Polonnaruwa", "Monaragala", "Hambantota", "Mannar",
    "Vavuniya", "Mullaitivu", "Kilinochchi"
]

export function DeliveryEstimator() {
    const [district, setDistrict] = useState<string | undefined>()

    const getRate = (d: string) => {
        if (d === "Colombo") return { price: 350, time: "24 Hours" }
        if (["Gampaha", "Kalutara"].includes(d)) return { price: 450, time: "24-48 Hours" }
        return { price: 650, time: "48-72 Hours" }
    }

    const rate = district ? getRate(district) : null

    return (
        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/5 space-y-4">
            <div className="flex items-center gap-3 text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-white/5">
                <FaTruck className="text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest">Delivery Estimator</h3>
            </div>

            <div className="space-y-4">
                <Select onValueChange={setDistrict}>
                    <SelectTrigger className="bg-white dark:bg-black border-gray-200 dark:border-white/10 h-12">
                        <SelectValue placeholder="Select Your District" />
                    </SelectTrigger>
                    <SelectContent>
                        {SRI_LANKAN_DISTRICTS.map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {rate && (
                    <div className="flex items-center justify-between text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-1">
                            <p className="font-medium text-gray-500 dark:text-gray-400">Estimated Cost</p>
                            <p className="font-black text-lg">LKR {rate.price}.00</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="font-medium text-gray-500 dark:text-gray-400">Delivery Time</p>
                            <p className="font-bold text-primary">{rate.time}</p>
                        </div>
                    </div>
                )}

                <p className="text-[10px] text-gray-400 leading-relaxed">
                    * Rates are estimates provided by prompt courier integration. Final rate calculated at checkout.
                </p>
            </div>
        </div>
    )
}
