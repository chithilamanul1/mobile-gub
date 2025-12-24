import { CreditCard, Calendar, AlertCircle } from "lucide-react"

interface FinancingOptionsProps {
    price: number
}

export function FinancingOptions({ price }: FinancingOptionsProps) {
    // Calculations
    const mintpayInstallment = Math.round(price / 3)
    const kokoInstallment = Math.round(price / 3)

    // Bank standard estimates (assuming ~15% interest for generic display or flat calculation)
    // Displaying raw division for "Starts from" marketing appeal
    const bank12Month = Math.round(price / 12)
    const bank24Month = Math.round(price / 24)

    return (
        <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                Flexible Payment Options
            </h4>

            <div className="grid gap-3">
                {/* Mintpay Option */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-[#00d09c]/10 flex items-center justify-center">
                            <span className="font-bold text-[#00d09c] text-xs">M</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase">Mintpay</p>
                            <p className="text-[9px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest">
                                3 Interest-Free Installments
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[12px] font-black text-emerald-500">₨ {mintpayInstallment.toLocaleString()}</p>
                        <p className="text-[8px] font-bold text-gray-400 dark:text-white/20 uppercase tracking-widest">/ Month</p>
                    </div>
                </div>

                {/* Koko Option */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 group hover:border-pink-500/30 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                            <span className="font-bold text-pink-500 text-xs">K</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase">Koko</p>
                            <p className="text-[9px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest">
                                Pay in 3
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[12px] font-black text-pink-500">₨ {kokoInstallment.toLocaleString()}</p>
                        <p className="text-[8px] font-bold text-gray-400 dark:text-white/20 uppercase tracking-widest">/ Month</p>
                    </div>
                </div>

                {/* Bank EMI Option */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase">Credit Card EMI</p>
                            <p className="text-[9px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest">
                                Up to 24 Months
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex flex-col items-end">
                            <p className="text-[12px] font-black text-blue-500">
                                <span className="text-[9px] text-gray-400 dark:text-white/30 mr-1">FROM</span>
                                ₨ {bank24Month.toLocaleString()}
                            </p>
                        </div>
                        <p className="text-[8px] font-bold text-gray-400 dark:text-white/20 uppercase tracking-widest">/ Month</p>
                    </div>
                </div>

                <div className="flex items-start gap-2 mt-2 px-2">
                    <AlertCircle className="w-3 h-3 text-gray-400 dark:text-white/20 mt-0.5" />
                    <p className="text-[8px] font-medium text-gray-400 dark:text-white/20 leading-relaxed uppercase tracking-wide">
                        * Eligibility subject to bank approval. Terms and conditions apply. Interest rates may vary by bank.
                    </p>
                </div>
            </div>
        </div>
    )
}
