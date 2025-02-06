import axios from 'axios';
import { languages } from './seedData/languages';
import { studyModes } from './seedData/studyModes';
import { decks } from './seedData/decks';
import { cards } from './seedData/cards';
import { prisma } from './prisma';

async function main() {
    return;
    for (const language of languages) {
        await prisma.language.upsert({
            where: { identifier: language.identifier },
            update: { name: language.name },
            create: { identifier: language.identifier, name: language.name },
        });
    }

    for (const studyMode of studyModes) {
        await prisma.studyMode.upsert({
            where: { identifier: studyMode.identifier },
            update: { name: studyMode.name },
            create: { identifier: studyMode.identifier, name: studyMode.name },
        });
    }

    const users = await prisma.user.findMany();

    for (const deck of decks) {
        const deckCreateUpdate = {
            title: deck.title,
            description: deck.description,
            public: deck.public,
            sourceLanguageId: deck.sourceLanguageId,
            studyLanguageId: deck.studyLanguageId,
            authorId: deck.authorId,
            studyModeId: deck.studyModeId,
            users: {
                connect: users.map((user) => ({ id: user.id }))
            }
        };
        await prisma.deck.upsert({
            where: { id: deck.id },
            update: deckCreateUpdate,
            create: deckCreateUpdate,
        });
    }

    for (const card of cards) {
        const cardCreateUpdate = { front: card.front, back: card.back, hint: card.hint, authorId: card.authorId, deckId: card.deckId, srsLevel: card.srsLevel, nextStudy: card.nextStudy };
        await prisma.card.upsert({
            where: { id: card.id },
            update: cardCreateUpdate,
            create: cardCreateUpdate,
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });