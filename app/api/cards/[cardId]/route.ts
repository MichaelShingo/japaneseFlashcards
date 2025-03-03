import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';
import { Card } from '@prisma/client';
import { responses } from '../../constants';
import { NextAuthRequest } from '@/app/utils/common';

export const DELETE = auth(async function DELETE(
	request: NextAuthRequest,
	{ params }: { params: { cardId: string } }
) {
	try {
		if (!request.auth) {
			return responses.notAuthenticated();
		}

		const { cardId } = params;
		const card: Card = await prisma.card.delete({
			where: {
				id: Number(cardId),
			},
		});

		return NextResponse.json(card);
	} catch (error) {
		return responses.badRequest(error.message);
	}
});

export const PATCH = auth(async function PATCH(
	request: NextAuthRequest,
	{ params }: { params: { cardId: string } }
) {
	try {
		if (!request.auth) {
			return responses.notAuthenticated();
		}

		console.log('path card id');
		const body = await request.json();
		const { japanese, japaneseSynonyms, english, englishSynonyms, hint, srsLevel } = body;
		const { cardId } = params;

		const card: Card = await prisma.card.update({
			where: {
				id: Number(cardId),
			},
			data: {
				japanese,
				japaneseSynonyms,
				english,
				englishSynonyms,
				hint,
				srsLevel,
			},
		});

		return NextResponse.json(card);
	} catch (error) {
		return responses.badRequest('Failed to edit card.');
	}
});

export const GET = auth(async function GET(
	request: NextAuthRequest,
	{ params }: { params: { cardId: string } }
) {
	try {
		if (!request.auth) {
			return responses.notAuthenticated();
		}
		const { cardId } = params;
		const { searchParams } = new URL(request.url);

		const card: Card = await prisma.card.findUnique({
			where: {
				id: Number(cardId),
			},
		});

		return NextResponse.json(card);
	} catch (error) {
		return responses.badRequest('Failed to create card.');
	}
});
