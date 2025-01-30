import { Deck } from "@prisma/client";
import { languageSeedIds } from "./languages";
import { userSeedIds } from "./users";
import { studyModeSeedIds } from "./studyModes";
import { reverseObject } from "@/utils/data";

const defaultRelations = {
    public: true,
    sourceLanguageId: languageSeedIds.English,
    studyLanguageId: languageSeedIds.Japanese,
    authorId: userSeedIds['mcrawford5376@gmail.com'],
    studyModeId: studyModeSeedIds.recognitionFront,
};

export const deckSeedIds: Record<string, number> = {
    'Japanese Music Vocabulary': 1,
    'Japanese Tech Business Vocabulary': 2,
    'Japanese Cities Vocabulary': 3,
    'Japanese Harry Potter Vocabulary': 4,
    'Japanese Politics Vocabulary': 5,
};

export const reverseDeckSeedIds: Record<number, string> = reverseObject(deckSeedIds);

export const decks: Omit<Deck, 'createdAt' | 'updatedAt'>[] = [
    {
        id: 1,
        title: 'Japanese Music Vocabulary',
        description: 'Covers everything you need to know to talk about music in the context of rehearsals, music theory, and more.',
        ...defaultRelations,
    },
    {
        id: 2,
        title: 'Japanese Tech Business Vocabulary',
        description: 'An ongoing list of terms commonly used as a software developer in a Japanese tech company.',
        ...defaultRelations,
    },
    {
        id: 3,
        title: 'Japanese Cities Vocabulary',
        description: 'Covers vocabulary relating to cities, infrastructure, and transportation.',
        ...defaultRelations,
    },
    {
        id: 4,
        title: 'Japanese Harry Potter Vocabulary',
        description: 'An ongoing list of terms commonly used in the Harry Potter series.',
        ...defaultRelations,

    },
    {
        id: 5,
        title: 'Japanese Politics Vocabulary',
        description: 'Cover topics such as elections, political parties, and policy.',
        ...defaultRelations,
    },
];