// filepath: /d:/apps/japaneseFlashcards/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.card.createMany({
        data: [
            { front: 'Character 1', back: 'Description for character 1' },
        ],
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });