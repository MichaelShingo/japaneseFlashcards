import { Card } from "@prisma/client";
import { userSeedIds } from "./users";
import { deckSeedIds } from "./decks";

const defaultValues = { srsLevel: 0, nextStudy: new Date() };

export const cards: Omit<Card, 'createdAt' | 'updatedAt'>[] = [
    {
        id: 1,
        front: '三連符',
        back: 'triplet',
        hint: 'three connected token',
        authorId: userSeedIds[process.env.AUTH0_USER_EMAIL_01],
        deckId: deckSeedIds['Japanese Music Vocabulary'],
        ...defaultValues,
    },
    {
        id: 2,
        front: '二連符',
        back: 'duplet',
        hint: 'two connected token',
        authorId: userSeedIds[process.env.AUTH0_USER_EMAIL_01],
        deckId: deckSeedIds['Japanese Music Vocabulary'],
        ...defaultValues,
    },
    {
        id: 3,
        front: '伴奏 (ばんそう)',
        back: 'duplet',
        hint: 'two connected token',
        authorId: userSeedIds[process.env.AUTH0_USER_EMAIL_01],
        deckId: deckSeedIds['Japanese Music Vocabulary'],
        ...defaultValues,
    },
    {
        id: 4,
        front: '弦楽器 (げんがっき)',
        back: 'string instrument',
        hint: 'string instrument',
        authorId: userSeedIds[process.env.AUTH0_USER_EMAIL_01],
        deckId: deckSeedIds['Japanese Music Vocabulary'],
        ...defaultValues,
    },
    {
        id: 5,
        front: '全休符 (ぜんきゅうふ)',
        back: 'duplet',
        hint: 'whole rest token',
        authorId: userSeedIds[process.env.AUTH0_USER_EMAIL_01],
        deckId: deckSeedIds['Japanese Music Vocabulary'],
        ...defaultValues,
    },
    {
        id: 6,
        front: '全音符 ぜんおんぷ',
        back: 'whole note',
        hint: 'whole sound token',
        authorId: userSeedIds[process.env.AUTH0_USER_EMAIL_01],
        deckId: deckSeedIds['Japanese Music Vocabulary'],
        ...defaultValues,
    },
    {
        id: 7,
        front: '八分音符 はちぶおんぷ',
        back: 'eighth note',
        hint: '8 part sound token',
        authorId: userSeedIds[process.env.AUTH0_USER_EMAIL_01],
        deckId: deckSeedIds['Japanese Music Vocabulary'],
        ...defaultValues,
    },
];