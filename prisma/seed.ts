import { languages } from './seedData/languages';
import { studyModeIdentifiers, studyModes } from './seedData/studyModes';
import { deckNames, decks } from './seedData/decks';
import { cards } from './seedData/cards/cards';
import { prisma } from './prisma';
import { Card } from '@prisma/client';
import { userIds } from './seedData/users';

async function main() {
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
			update: {
				name: studyMode.name,
				description: studyMode.description,
				type: studyMode.type,
			},
			create: {
				identifier: studyMode.identifier,
				name: studyMode.name,
				description: studyMode.description,
				type: studyMode.type,
			},
		});
	}

	const newStudyModes = await prisma.studyMode.findMany();
	const japaneseRecognition = newStudyModes.find(
		(mode) => mode.identifier === studyModeIdentifiers.japaneseRecognition
	);

	for (const deck of decks) {
		const deckCreateUpdate = {
			title: deck.title,
			description: deck.description,
			isPublic: deck.isPublic,
			userId: deck.userId,
			studyModeId: japaneseRecognition.id,
		};
		await prisma.deck.upsert({
			where: {
				title_userId: {
					title: deckCreateUpdate.title,
					userId: deckCreateUpdate.userId,
				},
			},
			update: deckCreateUpdate,
			create: deckCreateUpdate,
		});
	}

	const newDecks = await prisma.deck.findMany();
	const musicDeck = newDecks.find(
		(deck) => deck.title === deckNames.music && deck.userId === userIds[0]
	);
	const harryPotterDeck = newDecks.find(
		(deck) => deck.title === deckNames.harryPotter && deck.userId === userIds[0]
	);
	const citiesDeck = newDecks.find(
		(deck) => deck.title === deckNames.cities && deck.userId === userIds[0]
	);
	const politicsDeck = newDecks.find(
		(deck) => deck.title === deckNames.politics && deck.userId === userIds[0]
	);
	const techBusinessDeck = newDecks.find(
		(deck) => deck.title === deckNames.techBusiness && deck.userId === userIds[0]
	);
	const travelDeck = newDecks.find(
		(deck) => deck.title === deckNames.travel && deck.userId === userIds[1]
	);

	const deckMap = {
		[deckNames.music]: musicDeck,
		[deckNames.harryPotter]: harryPotterDeck,
		[deckNames.cities]: citiesDeck,
		[deckNames.politics]: politicsDeck,
		[deckNames.techBusiness]: techBusinessDeck,
		[deckNames.travel]: travelDeck,
	};

	for (const card of cards) {
		const cardCreateUpdate: Omit<Card, 'createdAt' | 'updatedAt' | 'id'> = {
			japanese: card.japanese,
			hiragana: card.hiragana,
			japaneseSynonyms: [],
			english: card.english,
			englishSynonyms: [],
			hint: card.hint,
			userId: card.userId,
			deckId: deckMap[card.deckName].id,
			displayJapaneseSrsLevel: card.displayJapaneseSrsLevel,
			displayEnglishSrsLevel: card.displayEnglishSrsLevel,
			displayJapaneseNextStudy: card.displayJapaneseNextStudy,
			displayEnglishNextStudy: card.displayEnglishNextStudy,
		};
		await prisma.card.upsert({
			where: {
				japanese_deckId: {
					japanese: card.japanese,
					deckId: deckMap[card.deckName].id,
				},
			},
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
