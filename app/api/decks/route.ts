import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';
import { Card, Deck } from '@prisma/client';
import { responses } from '../constants';
import { NextAuthRequest } from '@/app/utils/common';
import {
	isDeckBothJapaneseAndEnglish,
	isDeckDisplayEnglish,
	isDeckDisplayJapanese,
} from '@/app/utils/studyModeFunctions';

export interface ExtendedDeck extends Deck {
	totalCards: number;
	learnCount: number;
	reviewCount: number;
	studiedCount: number;
	cardIds: number[];
}

export const GET = auth(async function GET(request: NextAuthRequest) {
	try {
		if (!request.auth) {
			return responses.notAuthenticated();
		}

		const { searchParams } = new URL(request.url);
		const filterPublic = Boolean(searchParams.get('public'));
		const filterPrivate = Boolean(searchParams.get('private'));
		let publicFilter: boolean | undefined = undefined;

		if (filterPublic && !filterPrivate) {
			publicFilter = true;
		} else if (filterPrivate && !filterPublic) {
			publicFilter = false;
		}

		const session = request.auth;
		const decks = await prisma.deck.findMany({
			where: {
				userId: session.user.id,
				title: {
					contains: searchParams.get('search'),
					mode: 'insensitive',
				},
				isPublic: publicFilter,
			},
			include: {
				cards: true,
				studyMode: true,
			},
		});

		const result: ExtendedDeck[] = [];
		const now = new Date();

		const cardIds: number[] = [];

		for (const deck of decks) {
			const totalCards = deck.cards.length;
			let dueCards: Card[] = [];

			if (isDeckBothJapaneseAndEnglish(deck.studyMode.identifier)) {
				dueCards.push(
					...deck.cards.filter(
						(card: Card) =>
							card.displayEnglishNextStudy < now || card.displayJapaneseNextStudy < now
					)
				);
			} else if (isDeckDisplayEnglish(deck.studyMode.identifier)) {
				dueCards.push(
					...deck.cards.filter((card: Card) => card.displayEnglishNextStudy < now)
				);
			} else if (isDeckDisplayJapanese(deck.studyMode.identifier)) {
				dueCards.push(
					...deck.cards.filter((card: Card) => card.displayJapaneseNextStudy < now)
				);
			}

			cardIds.push(...dueCards.map((card) => card.id));

			const learnCount = dueCards.filter(
				(card: Card) => card.displayJapaneseSrsLevel === 0
			).length;
			const reviewCount = dueCards.length - learnCount;
			const studiedCount = deck.cards.filter(
				(card: Card) => card.displayJapaneseSrsLevel > 0
			).length;
			result.push({
				...deck,
				totalCards,
				learnCount,
				reviewCount,
				studiedCount,
				cardIds,
			});
		}

		let filteredResult = result;
		const hasReviews = searchParams.get('hasReviews');
		const noReviews = searchParams.get('noReviews');
		if (searchParams.get('hasLearn')) {
			filteredResult = filteredResult.filter((deck) => deck.learnCount > 0);
			0;
		}
		if (hasReviews && !noReviews) {
			filteredResult = filteredResult.filter((deck) => deck.reviewCount > 0);
		}
		if (noReviews && !hasReviews) {
			filteredResult = filteredResult.filter((deck) => deck.reviewCount === 0);
		}

		return NextResponse.json(filteredResult);
	} catch (error) {
		console.log('🚀 ~ GET ~ error:', error);
		return responses.badRequest(error.message);
	}
});

export const POST = auth(async function POST(request: NextAuthRequest) {
	try {
		if (!request.auth) {
			return responses.notAuthenticated();
		}

		const body = await request.json();
		const { title, description, isPublic, studyModeId } = body;

		const session = request.auth;
		const { user } = session;

		if (!title) {
			return responses.badRequest('Title is requred.');
		}

		const deck = await prisma.deck.create({
			data: {
				userId: user.id,
				title,
				description,
				isPublic,
				studyModeId: Number(studyModeId),
			},
		});

		return NextResponse.json(deck);
	} catch (error) {
		return responses.badRequest(error.message);
	}
});
