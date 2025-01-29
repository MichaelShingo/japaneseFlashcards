import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { users } from './seedData/users';
import { languages } from './seedData/languages';
import { studyModes } from './seedData/studyModes';
import { decks } from './seedData/decks';
import { cards } from './seedData/cards';

const prisma = new PrismaClient();
const getAuth0Token = async () => {
    console.log(process.env.AUTH0_CLIENT_ID);
    console.log(process.env.AUTH0_CLIENT_SECRET);
    // how about manually create 5 sample users and then sync them manually????
    var options = {
        method: 'POST',
        url: 'https://dev-fxjf0716knkdn6od.us.auth0.com/oauth/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.AUTH0_EXPLORER_CLIENT_ID,
            client_secret: process.env.AUTH0_EXPLORER_CLIENT_SECRET,
            audience: 'https://dev-fxjf0716knkdn6od.us.auth0.com/api/v2/',
        })
    };

    const response = await axios.request(options);
    return response.data.access_token;
};

const getAuth0Users = async (token: string) => {
    const response = await axios.get('https://dev-7v8z1v7z.us.auth0.com/api/v2/users', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

async function main() {
    for (const user of users) {
        await prisma.user.upsert({
            where: { auth0Id: user.auth0Id },
            update: { email: user.email, lastName: user.lastName, firstName: user.firstName },
            create: { auth0Id: user.auth0Id, email: user.email, lastName: user.lastName, firstName: user.firstName },
        });
    }

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

    for (const deck of decks) {
        const deckCreateUpdate = { title: deck.title, description: deck.description, public: deck.public, sourceLanguageId: deck.sourceLanguageId, studyLanguageId: deck.studyLanguageId, authorId: deck.authorId, studyModeId: deck.studyModeId };
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