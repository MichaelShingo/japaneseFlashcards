import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';
import { Card, Deck } from '@prisma/client';
import { NextAuthRequest } from '@/app/utils/common';
import { responses } from '../constants';
import {
	isDeckBothJapaneseAndEnglish,
	isDeckDisplayEnglish,
	isDeckDisplayJapanese,
} from '@/app/utils/studyModeFunctions';

export const GET = auth(async function GET(request: NextAuthRequest) {
	try {
		if (!request.auth) {
			return responses.notAuthenticated();
		}

		const { searchParams } = new URL(request.url);
		const dueForStudy = Boolean(searchParams.get('dueForStudy'));
		const deckId = Number(searchParams.get('deckId'));
		const cardIdsParam: string = searchParams.get('cardIds');

		const cardIds: number[] = [];

		if (cardIdsParam) {
			cardIds.push(...cardIdsParam.split(',').map((cardId: string) => Number(cardId)));
		}

		const deck = await prisma.deck.findUnique({
			where: {
				id: deckId,
			},
			include: {
				studyMode: {},
			},
		});

		let cards: Card[];

		if (isDeckBothJapaneseAndEnglish(deck.studyMode.identifier)) {
			cards = await prisma.card.findMany({
				where: {
					deckId: deckId ? deckId : undefined,
					OR: [
						{
							displayJapaneseNextStudy: {
								lt: dueForStudy ? new Date() : undefined,
							},
						},
						{
							displayEnglishNextStudy: {
								lt: dueForStudy ? new Date() : undefined,
							},
						},
					],
				},
			});
		} else if (isDeckDisplayJapanese(deck.studyMode.identifier)) {
			cards = await prisma.card.findMany({
				where: {
					deckId: deckId ? deckId : undefined,
					displayJapaneseNextStudy: {
						lt: dueForStudy ? new Date() : undefined,
					},
				},
			});
		} else if (isDeckDisplayEnglish(deck.studyMode.identifier)) {
			cards = await prisma.card.findMany({
				where: {
					deckId: deckId ? deckId : undefined,
					displayEnglishNextStudy: {
						lt: dueForStudy ? new Date() : undefined,
					},
				},
			});
		}

		return NextResponse.json(cards);
	} catch (error) {
		console.log('🚀 ~ GET ~ error:', error);
		return responses.badRequest('Failed to create deck.');
	}
});
