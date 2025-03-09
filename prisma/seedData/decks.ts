import { Deck } from '@prisma/client';
import { studyModeSeedIds } from './studyModes';
import { userIds } from './users';

const defaultRelations = {
	isPublic: true,
	userId: userIds[0],
	studyModeId: studyModeSeedIds.recognitionFront,
};

export const deckNames: Record<string, string> = {
	music: 'Music',
	techBusiness: 'Tech Business',
	cities: 'Cities',
	harryPotter: 'Harry Potter',
	politics: 'Politics',
	travel: 'Travel',
};

export const decks: Omit<Deck, 'createdAt' | 'updatedAt' | 'id'>[] = [
	{
		title: deckNames.music,
		description:
			'Covers everything you need to know to talk about music in the context of rehearsals, music theory, and more.',
		...defaultRelations,
	},
	{
		title: deckNames.techBusiness,
		description:
			'An ongoing list of terms commonly used as a software developer in a Japanese tech company.',
		...defaultRelations,
		isPublic: false,
	},
	{
		title: deckNames.cities,
		description:
			'Covers vocabulary relating to cities, infrastructure, and transportation.',
		...defaultRelations,
	},
	{
		title: deckNames.harryPotter,
		description: 'An ongoing list of terms commonly used in the Harry Potter series.',
		...defaultRelations,
	},
	{
		title: deckNames.politics,
		description: 'Cover topics such as elections, political parties, and policy.',
		...defaultRelations,
		isPublic: false,
	},
	{
		title: deckNames.travel,
		description: 'Includes terms related to travel.',
		...defaultRelations,
		isPublic: true,
		userId: userIds[1],
	},
];
