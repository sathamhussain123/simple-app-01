import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const products = [
        { name: 'Masala Tea', category: 'TEA' as any, price: 15, isAvailable: true },
        { name: 'Ginger Tea', category: 'TEA' as any, price: 15, isAvailable: true },
        { name: 'Filter Coffee', category: 'DRINKS' as any, price: 20, isAvailable: true },
        { name: 'Samosa', category: 'SNACKS' as any, price: 15, isAvailable: true },
        { name: 'Vada Pav', category: 'SNACKS' as any, price: 20, isAvailable: true },
        { name: 'Poha', category: 'SNACKS' as any, price: 30, isAvailable: true },
        { name: 'Veg Thali', category: 'MEALS' as any, price: 100, isAvailable: true },
        { name: 'Chicken Thali', category: 'MEALS' as any, price: 150, isAvailable: true },
        { name: 'Cold Drink', category: 'DRINKS' as any, price: 40, isAvailable: true },
        { name: 'Mineral Water', category: 'DRINKS' as any, price: 20, isAvailable: true },
    ]

    console.log('Start seeding products...')
    for (const p of products) {
        const product = await prisma.product.create({
            data: p,
        })
        console.log(`Created product with id: ${product.id}`)
    }

    // Seed master and worker roles
    console.log('Start seeding users...')
    const hashedAdminPassword = await bcrypt.hash("master123", 10)
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@vapor.com' },
        update: {},
        create: {
            name: 'Master Owner',
            email: 'admin@vapor.com',
            password: hashedAdminPassword,
            role: 'ADMIN',
        },
    })
    console.log(`Created admin user: ${adminUser.email}`)

    const hashedStaffPassword = await bcrypt.hash("worker123", 10)
    const staffUser = await prisma.user.upsert({
        where: { email: 'staff@vapor.com' },
        update: {},
        create: {
            name: 'Cashier Staff',
            email: 'staff@vapor.com',
            password: hashedStaffPassword,
            role: 'STAFF',
        },
    })
    console.log(`Created staff user: ${staffUser.email}`)

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
