import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';
import { Card } from '@prisma/client';
import { NextAuthRequest } from '@/app/utils/common';
import { responses } from '../../constants';

export const GET = auth(async function GET(request: NextAuthRequest) {
	try {
		if (!request.auth) {
			return responses.notAuthenticated();
		}

		const { searchParams } = new URL(request.url);
		const deckId = Number(searchParams.get('deckId'));
		const searchTerm = searchParams.get('searchTerm');
		console.log('🚀 ~ GET ~ searchTerm:', searchTerm);

		const cards: Card[] = await prisma.card.findMany({
			where: {
				deckId: deckId,
				OR: [
					{
						english: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
					{
						japanese: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
					{
						hiragana: {
							contains: searchTerm,
							mode: 'insensitive',
						},
					},
				],
			},
		});

		return NextResponse.json(cards);
	} catch (error) {
		return responses.badRequest('Failed to fetch cards.');
	}
});
