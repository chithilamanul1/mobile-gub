import { TRCSLVerifier } from "@/components/trcsl/TRCSLVerifier"

export default function WarrantyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold text-center mb-8">Warranty & TRCSL Verification</h1>
            <TRCSLVerifier />
        </div>
    )
}
