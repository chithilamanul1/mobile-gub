"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa"
import { MdSmartphone } from "react-icons/md"

export function TRCSLVerifier() {
    const [imei, setImei] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{
        status: "approved" | "pending" | "not_found" | "invalid"
        message: string
        deviceInfo?: { model: string; brand: string; soldDate?: string }
    } | null>(null)

    const verifyIMEI = async () => {
        if (imei.length < 15) {
            setResult({
                status: "invalid",
                message: "IMEI must be 15 digits long"
            })
            return
        }

        setLoading(true)

        // Call our internal API to check sold devices
        try {
            const response = await fetch(`/api/trcsl/check?imei=${imei}`)
            const data = await response.json()

            setResult(data)
        } catch (error) {
            setResult({
                status: "not_found",
                message: "Unable to verify at this time. Please try manual verification."
            })
        } finally {
            setLoading(false)
        }
    }

    const sendSMSVerification = () => {
        // Open SMS app with pre-filled message to 1909
        const smsBody = `REG ${imei}`
        window.open(`sms:1909?body=${encodeURIComponent(smsBody)}`, '_blank')
    }

    return (
        <Card className="glass-dark border-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MdSmartphone className="text-primary" />
                    TRCSL IMEI Verification
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                        Enter IMEI Number (15 digits)
                    </label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="354793070000000"
                            value={imei}
                            onChange={(e) => setImei(e.target.value.replace(/\D/g, '').slice(0, 15))}
                            className="bg-white/5 border-white/10 font-mono"
                            maxLength={15}
                        />
                        <Button
                            onClick={verifyIMEI}
                            disabled={loading || imei.length !== 15}
                            className="bg-primary text-black font-bold hover:bg-primary/90"
                        >
                            {loading ? "Checking..." : "Verify"}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Dial *#06# on your phone to find your IMEI number
                    </p>
                </div>

                {result && (
                    <div className={`p-4 rounded-lg border-2 ${result.status === "approved" ? "border-green-500 bg-green-500/10" :
                            result.status === "pending" ? "border-yellow-500 bg-yellow-500/10" :
                                result.status === "invalid" ? "border-red-500 bg-red-500/10" :
                                    "border-gray-500 bg-gray-500/10"
                        }`}>
                        <div className="flex items-start gap-3">
                            {result.status === "approved" && <FaCheckCircle className="text-green-500 w-6 h-6 mt-1" />}
                            {result.status === "pending" && <FaExclamationTriangle className="text-yellow-500 w-6 h-6 mt-1" />}
                            {(result.status === "not_found" || result.status === "invalid") && <FaTimesCircle className="text-red-500 w-6 h-6 mt-1" />}

                            <div className="flex-1">
                                <h4 className="font-bold mb-1">
                                    {result.status === "approved" && "✓ TRCSL Approved"}
                                    {result.status === "pending" && "Pending Verification"}
                                    {result.status === "not_found" && "Not Found in Our Records"}
                                    {result.status === "invalid" && "Invalid IMEI"}
                                </h4>
                                <p className="text-sm text-muted-foreground">{result.message}</p>

                                {result.deviceInfo && (
                                    <div className="mt-3 p-3 bg-black/20 rounded border border-white/5">
                                        <p className="text-sm"><strong>Device:</strong> {result.deviceInfo.brand} {result.deviceInfo.model}</p>
                                        {result.deviceInfo.soldDate && (
                                            <p className="text-sm"><strong>Sold:</strong> {result.deviceInfo.soldDate}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-white/10 space-y-3">
                    <h4 className="font-bold text-sm">Manual Verification Options</h4>

                    <Button
                        onClick={sendSMSVerification}
                        variant="outline"
                        className="w-full justify-start"
                        disabled={imei.length !== 15}
                    >
                        <MdSmartphone className="mr-2" />
                        Send SMS to 1909 (Official TRCSL)
                    </Button>

                    <a
                        href="https://www.imeiinfo.com/check-imei/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <Button variant="outline" className="w-full justify-start">
                            🌐 Check via DIRBS Portal
                        </Button>
                    </a>

                    <div className="text-xs text-muted-foreground space-y-1">
                        <p>• SMS Rate: Standard operator charges apply</p>
                        <p>• DIRBS: Global IMEI database verification</p>
                        <p>• Our database: Devices sold by Mobile Hub</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
