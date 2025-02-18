import { Deck } from "@prisma/client";
import { studyModeSeedIds } from "./studyModes";
import { reverseObject } from "@/utils/data";
import { userIds } from "./users";

const defaultRelations = {
  isPublic: true,
  userId: userIds[0],
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
    title: 'Music',
    description: 'Covers everything you need to know to talk about music in the context of rehearsals, music theory, and more.',
    ...defaultRelations,
  },
  {
    id: 2,
    title: 'Tech Business',
    description: 'An ongoing list of terms commonly used as a software developer in a Japanese tech company.',
    ...defaultRelations,
    isPublic: false,
  },
  {
    id: 3,
    title: 'Cities',
    description: 'Covers vocabulary relating to cities, infrastructure, and transportation.',
    ...defaultRelations,
  },
  {
    id: 4,
    title: 'Harry Potter',
    description: 'An ongoing list of terms commonly used in the Harry Potter series.',
    ...defaultRelations,

  },
  {
    id: 5,
    title: 'Politics',
    description: 'Cover topics such as elections, political parties, and policy.',
    ...defaultRelations,
    isPublic: false,
  },
];