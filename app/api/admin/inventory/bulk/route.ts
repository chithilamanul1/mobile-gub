import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Papa from 'papaparse'

interface CSVRow {
    imei: string
    productId: string
    is_registered?: string
}

// POST bulk import IMEIs from CSV
export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Validate file type
        if (!file.name.endsWith('.csv')) {
            return NextResponse.json(
                { error: 'File must be a CSV' },
                { status: 400 }
            )
        }

        // Read file content
        const text = await file.text()

        // Parse CSV
        const parsed = Papa.parse<CSVRow>(text, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim().toLowerCase()
        })

        if (parsed.errors.length > 0) {
            return NextResponse.json(
                { error: 'CSV parsing error', details: parsed.errors },
                { status: 400 }
            )
        }

        const rows = parsed.data

        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'CSV file is empty' },
                { status: 400 }
            )
        }

        // Validate required columns
        const requiredColumns = ['imei', 'productid']
        const firstRow = rows[0] as any
        const hasRequiredColumns = requiredColumns.every(col =>
            Object.keys(firstRow).some(key => key.toLowerCase() === col)
        )

        if (!hasRequiredColumns) {
            return NextResponse.json(
                { error: 'CSV must have columns: imei, productId' },
                { status: 400 }
            )
        }

        // Process rows
        const results = {
            total: rows.length,
            success: 0,
            failed: 0,
            duplicates: 0,
            errors: [] as string[]
        }

        for (const row of rows) {
            try {
                // Validate IMEI format
                const imei = row.imei?.trim()
                if (!imei || !/^\d{15}$/.test(imei)) {
                    results.failed++
                    results.errors.push(`Invalid IMEI: ${imei}`)
                    continue
                }

                // Check if IMEI already exists
                const existing = await prisma.iMEI.findUnique({
                    where: { number: imei }
                })

                if (existing) {
                    results.duplicates++
                    continue
                }

                // Verify product exists
                const productId = row.productId?.trim()
                const product = await prisma.product.findUnique({
                    where: { id: productId }
                })

                if (!product) {
                    results.failed++
                    results.errors.push(`Product not found: ${productId}`)
                    continue
                }

                // Create IMEI and update stock
                await prisma.$transaction([
                    prisma.iMEI.create({
                        data: {
                            number: imei,
                            productId: productId,
                            is_registered: row.is_registered?.toLowerCase() === 'true' || row.is_registered === '1',
                            status: 'AVAILABLE'
                        }
                    }),
                    prisma.product.update({
                        where: { id: productId },
                        data: { stock_count: { increment: 1 } }
                    })
                ])

                results.success++
            } catch (error) {
                results.failed++
                results.errors.push(`Error processing row: ${JSON.stringify(row)}`)
            }
        }

        return NextResponse.json({
            message: 'Bulk import completed',
            results
        })
    } catch (error) {
        console.error('Bulk import error:', error)
        return NextResponse.json(
            { error: 'Failed to process bulk import' },
            { status: 500 }
        )
    }
}
