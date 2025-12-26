
const { PrismaClient } = require('@prisma/client');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Firebase
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : require('./firebase-service-account.json'); // Fallback

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

async function migrate() {
    console.log('🚀 Starting migration...');

    // 1. Migrate Products
    const products = await prisma.product.findMany({ include: { images: true, imeis: true, reviews: true } });
    console.log(`📦 Found ${products.length} products`);

    for (const p of products) {
        const docRef = db.collection('products').doc(p.id);
        const { images, imeis, reviews, ...productData } = p;

        await docRef.set({
            ...productData,
            images: images.map(i => i.url),
            updatedAt: new Date(),
            createdAt: p.createdAt
        });

        // Migrate Sub-collections if needed, or just keep them in main doc (NoSQL style)
        // For IMEIs, we might want a separate top-level collection if we search by IMEI often,
        // but for now, let's keep it simple.
        // Actually, let's add stock as a simple number and maybe a subcollection for specific IMEIs
    }

    // 2. Migrate Users
    const users = await prisma.user.findMany();
    console.log(`bust_in_silhouette Found ${users.length} users`);
    for (const u of users) {
        await db.collection('users').doc(u.id).set({
            name: u.name,
            email: u.email,
            image: u.image,
            role: u.role,
            password: u.password, // Be careful: bcrypt hash. Firestore usage might differ.
            createdAt: u.createdAt
        });
    }

    // 3. Migrate Orders
    const orders = await prisma.order.findMany({ include: { items: true } });
    console.log(`📝 Found ${orders.length} orders`);
    for (const o of orders) {
        await db.collection('orders').doc(o.id).set({
            userId: o.userId,
            total: o.total,
            status: o.status,
            items: o.items, // JSON array of items
            createdAt: o.createdAt
        });
    }

    // 4. Migrate Reviews
    const reviews = await prisma.review.findMany();
    console.log(`⭐ Found ${reviews.length} reviews`);
    for (const r of reviews) {
        await db.collection('reviews').doc(r.id).set({
            rating: r.rating,
            comment: r.comment,
            images: JSON.parse(r.images || '[]'),
            isPublic: r.isPublic,
            userId: r.userId,
            productId: r.productId,
            type: r.type,
            createdAt: r.createdAt
        });
    }

    console.log('✅ Migration complete!');
    await prisma.$disconnect();
}

migrate().catch(console.error);
