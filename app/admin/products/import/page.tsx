"use client"

import { useState } from "react"
import { useCSVReader, useCSVDownloader } from "react-papaparse"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Upload, AlertCircle, CheckCircle, FileSpreadsheet } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ImportProductsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [previewData, setPreviewData] = useState<any[]>([])
    const router = useRouter()

    const { CSVReader } = useCSVReader()

    const handleUpload = async () => {
        setIsLoading(true)
        try {
            const mappedData = previewData.map((row: any) => {
                // Parse "30.00 Piece" -> 30
                const stock = parseInt(row['Current Stock']?.split(' ')[0] || "0")
                const price = parseFloat(row['Selling Price'] || "0")
                const cost = parseFloat(row['Unit Purchase Price'] || "0")

                return {
                    sku: row['SKU'],
                    model_name: row['Product']?.replace(/&amp;/g, '&'),
                    brand: row['Brand'] || "Generic",
                    category: row['Category'] || "General",
                    price_lkr: price,
                    stock_count: stock,
                    description: `Migrated from Axeno POS. Type: ${row['Product Type']}`
                }
            })

            const res = await fetch("/api/admin/products/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ products: mappedData })
            })

            if (!res.ok) throw new Error("Import failed")

            const result = await res.json()
            toast.success(`Successfully imported ${result.count} products!`)
            router.push("/admin/products")

        } catch (error) {
            console.error(error)
            toast.error("Failed to import products")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-12 max-w-5xl mx-auto">
            <div className="space-y-4">
                <h1 className="text-4xl font-black uppercase tracking-tight text-white">POS Migration Gateway</h1>
                <p className="text-white/40 font-medium">Bulk import your inventory from Axeno Digital POS export file.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Uploader */}
                <Card className="bg-black border border-white/10 p-8 space-y-6">
                    <div className="flex items-center gap-3 text-primary mb-4">
                        <Upload className="w-5 h-5" />
                        <h3 className="uppercase font-bold tracking-widest text-sm">Step 1: Upload CSV</h3>
                    </div>

                    <CSVReader
                        onUploadAccepted={(results: any) => {
                            // Basic validation to check for Axeno headers
                            const headers = results.data[0]
                            if (!headers.includes("SKU") || !headers.includes("Selling Price")) {
                                toast.error("Invalid File Format. Please upload the Axeno POS export.")
                                return
                            }

                            // Transform array of arrays to array of objects
                            const data = results.data.slice(1).map((row: any) => {
                                const obj: any = {}
                                headers.forEach((header: string, i: number) => {
                                    obj[header] = row[i]
                                })
                                return obj
                            }).filter((row: any) => row['SKU']) // Filter empty rows

                            setPreviewData(data)
                            toast.success(`Loaded ${data.length} products for review`)
                        }}
                    >
                        {({ getRootProps, acceptedFile, ProgressBar }: any) => (
                            <>
                                <div
                                    {...getRootProps()}
                                    className="border-2 border-dashed border-white/10 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-white/5"
                                >
                                    {acceptedFile ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <FileSpreadsheet className="w-8 h-8 text-green-500" />
                                            <span className="text-white font-bold">{acceptedFile.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-white/40">
                                            <Upload className="w-8 h-8" />
                                            <span className="text-xs uppercase font-bold tracking-widest">Drop Axis POS CSV Here</span>
                                        </div>
                                    )}
                                </div>
                                <ProgressBar className="bg-primary h-1 mt-4 rounded-full" />
                            </>
                        )}
                    </CSVReader>
                </Card>

                {/* Preview & Stats */}
                <Card className="bg-white/5 border border-white/10 p-8 space-y-6">
                    <div className="flex items-center gap-3 text-primary mb-4">
                        <CheckCircle className="w-5 h-5" />
                        <h3 className="uppercase font-bold tracking-widest text-sm">Step 2: Review & Import</h3>
                    </div>

                    {previewData.length > 0 ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-black rounded-xl border border-white/10">
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Products Found</p>
                                    <p className="text-3xl font-black text-white">{previewData.length}</p>
                                </div>
                                <div className="p-4 bg-black rounded-xl border border-white/10">
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Total Value</p>
                                    <p className="text-xl font-black text-primary truncate">
                                        LKR {previewData.reduce((acc, row) => acc + (parseFloat(row['Selling\nPrice']?.toString().replace(/[^0-9.]/g, '') || 0) * parseInt(row['Current\nstock']?.toString().split(' ')[0] || 0)), 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="h-48 overflow-y-auto bg-black rounded-xl border border-white/10 p-4 space-y-2 text-xs">
                                {previewData.slice(0, 10).map((row, i) => (
                                    <div key={i} className="flex justify-between items-center text-white/60 border-b border-white/5 pb-2">
                                        <span className="truncate w-32">{row['Product']}</span>
                                        <div className="flex gap-4">
                                            <span>SKU: {row['SKU'] || 'N/A'}</span>
                                            <span className="text-white font-bold">{row['Selling\nPrice']}</span>
                                        </div>
                                    </div>
                                ))}
                                {previewData.length > 10 && (
                                    <p className="text-center text-white/20 italic pt-2">...and {previewData.length - 10} more</p>
                                )}
                            </div>

                            <Button
                                onClick={handleUpload}
                                disabled={isLoading}
                                className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest text-xs hover:bg-white"
                            >
                                {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "START MIGRATION"}
                            </Button>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-white/20 space-y-4">
                            <AlertCircle className="w-12 h-12" />
                            <p className="text-xs font-bold uppercase tracking-widest max-w-[200px]">
                                Upload a file to see preview stats and start migration.
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
