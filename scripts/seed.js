const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Clearing database...')
    await prisma.soldDevice.deleteMany()
    await prisma.iMEI.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()

    console.log('Seeding products...')

    const products = [
        {
            model_name: "iPhone 15 Pro Max",
            brand: "Apple",
            category: "Smartphone",
            price_lkr: 465000,
            stock_count: 12,
            is_trcsl_approved: true,
            image_url: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=2000",
            description: "The ultimate iPhone. Titanium design, A17 Pro chip, and a pro-grade camera system."
        },
        {
            model_name: "Galaxy S24 Ultra",
            brand: "Samsung",
            category: "Smartphone",
            price_lkr: 385000,
            stock_count: 8,
            is_trcsl_approved: true,
            image_url: "https://images.unsplash.com/photo-1707833558984-3293e794031c?q=80&w=2000",
            description: "Galaxy AI is here. 200MP camera, Snapdragon 8 Gen 3, and a built-in S Pen."
        },
        {
            model_name: "Pixel 8 Pro",
            brand: "Google",
            category: "Smartphone",
            price_lkr: 295000,
            stock_count: 5,
            is_trcsl_approved: true,
            image_url: "https://images.unsplash.com/photo-1696414917192-353d27457cd3?q=80&w=2000",
            description: "The most helpful Pixel yet. Powered by Tensor G3 and industry-leading AI features."
        },
        {
            model_name: "AirPods Pro (2nd Gen)",
            brand: "Apple",
            category: "Accessory",
            price_lkr: 85000,
            stock_count: 20,
            is_trcsl_approved: true,
            image_url: "https://images.unsplash.com/photo-1603919306350-06e1cc86d5e5?q=80&w=2000",
            description: "Magic, remastered. 2x more Active Noise Cancellation and personalized spatial audio."
        },
        {
            model_name: "MacBook Air M3",
            brand: "Apple",
            category: "Laptop",
            price_lkr: 545000,
            stock_count: 4,
            is_trcsl_approved: true,
            image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2000",
            description: "Strikingly thin and fast. The M3 chip brings even more capability to the world's most popular laptop."
        },
        {
            model_name: "Xiaomi 14 Ultra",
            brand: "Xiaomi",
            category: "Smartphone",
            price_lkr: 325000,
            stock_count: 3,
            is_trcsl_approved: true,
            image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=2000",
            description: "Lens to legend. Leica optics, 1-inch sensor, and unparalleled mobile photography."
        }
    ]

    for (const product of products) {
        const created = await prisma.product.create({
            data: product
        })

        // Create some IMEIs for smartphones
        if (product.category === "Smartphone") {
            for (let i = 0; i < 3; i++) {
                await prisma.iMEI.create({
                    data: {
                        number: Math.floor(Math.random() * 9000000000000) + 1000000000000 + "",
                        productId: created.id,
                        status: 'AVAILABLE'
                    }
                })
            }
        }
    }

    console.log('Seeding completed successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
