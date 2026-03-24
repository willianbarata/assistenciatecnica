const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})

async function main() {
    console.log('Starting seed...')
    // Clients
    const client1 = await prisma.client.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'João Silva',
            email: 'joao@example.com',
            phone: '11999999999',
            address: 'Rua das Flores, 123'
        }
    })
    console.log('Client 1 created/found')

    const client2 = await prisma.client.upsert({
        where: { id: 2 },
        update: {},
        create: {
            name: 'Maria Souza',
            email: 'maria@example.com',
            phone: '11988888888',
            address: 'Av. Paulista, 1000'
        }
    })

    // Products (Parts)
    const product1 = await prisma.product.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Tela LCD iPhone 11',
            description: 'Original Quality',
            price: 350.00,
            cost: 150.00,
            stock: 10
        }
    })

    const product2 = await prisma.product.upsert({
        where: { id: 2 },
        update: {},
        create: {
            name: 'Bateria Samsung S20',
            description: 'Original',
            price: 180.00,
            cost: 80.00,
            stock: 5
        }
    })

    // Services
    const service1 = await prisma.service.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Troca de Tela',
            description: 'Mão de obra especializada',
            price: 100.00
        }
    })

    const service2 = await prisma.service.upsert({
        where: { id: 2 },
        update: {},
        create: {
            name: 'Banho Químico',
            description: 'Desoxidação',
            price: 150.00
        }
    })

    // Service Order (Closed)
    const count = await prisma.serviceOrder.count()
    if (count === 0) {
        await prisma.serviceOrder.create({
            data: {
                clientId: client1.id,
                device: 'iPhone 11 Product Red',
                description: 'Tela Quebrada',
                status: 'COMPLETED',
                total: 450.00,
                items: {
                    create: [
                        {
                            productId: product1.id,
                            unitPrice: 350.00,
                            unitCost: 150.00,
                            quantity: 1
                        },
                        {
                            serviceId: service1.id,
                            unitPrice: 100.00,
                            quantity: 1
                        }
                    ]
                }
            }
        })
        console.log('Created Service Order')
    }

    console.log('Seed completed')
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
