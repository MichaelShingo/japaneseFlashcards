import { Card } from '@prisma/client';
import { harryPotterCards } from './harryPotterCards';
import { musicCards } from './musicCards';
import { techBusinessCards } from './techBusinessCards';
import { citiesCards } from './citiesCards';
import { politicsCards } from './politicsCards';
import { travelCards } from './travelCards';

export type SeedCard = Omit<
	Card & { deckName: string },
	'createdAt' | 'updatedAt' | 'id' | 'deckId'
>[];

export const cards: SeedCard = [
	...citiesCards,
	...harryPotterCards,
	...musicCards,
	...politicsCards,
	...techBusinessCards,
	...travelCards,
];
