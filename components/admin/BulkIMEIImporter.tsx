"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaFileUpload, FaDownload, FaCheckCircle, FaTimesCircle } from "react-icons/fa"

interface BulkImportResult {
    total: number
    success: number
    failed: number
    duplicates: number
    errors: string[]
}

export function BulkIMEIImporter({ onSuccess }: { onSuccess?: () => void }) {
    const [uploading, setUploading] = useState(false)
    const [result, setResult] = useState<BulkImportResult | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const downloadTemplate = () => {
        const csv = `imei,productId,is_registered\n358128870236764,your-product-id-here,true\n358128870236765,your-product-id-here,true`
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'imei_import_template.csv'
        a.click()
    }

    const handleFileSelect = async (file: File) => {
        if (!file.name.endsWith('.csv')) {
            alert('Please select a CSV file')
            return
        }

        setUploading(true)
        setResult(null)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/admin/inventory/bulk', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()

            if (res.ok) {
                setResult(data.results)
                if (data.results.success > 0) {
                    onSuccess?.()
                }
            } else {
                alert(`Import failed: ${data.error}`)
            }
        } catch (error) {
            alert('Import failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FaFileUpload />
                    Bulk IMEI Import
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                    <p>Upload a CSV file to import multiple IMEIs at once.</p>
                    <p><strong>Required columns:</strong> imei, productId, is_registered (optional)</p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={downloadTemplate}
                        className="flex-1"
                    >
                        <FaDownload className="mr-2" />
                        Download Template
                    </Button>

                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold"
                    >
                        <FaFileUpload className="mr-2" />
                        {uploading ? 'Uploading...' : 'Select CSV'}
                    </Button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileSelect(file)
                    }}
                    className="hidden"
                />

                {result && (
                    <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                        <h4 className="font-bold mb-3">Import Results</h4>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Total:</span>
                                <span className="font-bold">{result.total}</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-500">
                                <FaCheckCircle />
                                <span className="font-bold">{result.success} imported</span>
                            </div>
                            <div className="flex items-center gap-2 text-yellow-500">
                                <span>⚠️ {result.duplicates} duplicates</span>
                            </div>
                            <div className="flex items-center gap-2 text-red-500">
                                <FaTimesCircle />
                                <span className="font-bold">{result.failed} failed</span>
                            </div>
                        </div>

                        {result.errors.length > 0 && (
                            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded">
                                <p className="text-sm font-bold text-red-500 mb-2">Errors:</p>
                                <div className="text-xs space-y-1 max-h-32 overflow-auto custom-scrollbar">
                                    {result.errors.slice(0, 10).map((error, i) => (
                                        <p key={i} className="text-red-400">• {error}</p>
                                    ))}
                                    {result.errors.length > 10 && (
                                        <p className="text-red-400">... and {result.errors.length - 10} more</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
