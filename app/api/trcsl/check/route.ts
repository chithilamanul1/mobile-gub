import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const imei = searchParams.get('imei')

        if (!imei || imei.length !== 15) {
            return NextResponse.json({
                status: 'invalid',
                message: 'IMEI must be exactly 15 digits'
            })
        }

        // Check if this IMEI exists in our sold devices
        const soldDevice = await prisma.soldDevice.findFirst({
            where: { imei },
            include: {
                product: true
            }
        })

        if (soldDevice) {
            return NextResponse.json({
                status: 'approved',
                message: `This device was sold by Mobile Hub and is TRCSL registered.`,
                deviceInfo: {
                    brand: soldDevice.product.brand,
                    model: soldDevice.product.model_name,
                    soldDate: soldDevice.sold_at.toLocaleDateString('en-GB')
                }
            })
        }

        // Check if IMEI exists in our inventory (not yet sold)
        const imeiRecord = await prisma.iMEI.findUnique({
            where: { number: imei },
            include: { product: true }
        })

        if (imeiRecord) {
            return NextResponse.json({
                status: 'pending',
                message: `This device is in our inventory and will be registered upon sale.`,
                deviceInfo: {
                    brand: imeiRecord.product.brand,
                    model: imeiRecord.product.model_name
                }
            })
        }

        // Not found in our database
        return NextResponse.json({
            status: 'not_found',
            message: 'This IMEI is not in our records. Please use manual verification methods below or contact us if you purchased from Mobile Hub.'
        })

    } catch (error) {
        console.error('TRCSL Check Error:', error)
        return NextResponse.json({
            status: 'not_found',
            message: 'Verification service temporarily unavailable. Please try manual methods.'
        }, { status: 500 })
    }
}
