import { NextAuthRequest } from '@/app/utils/common';
import { auth } from '@/auth';
import { responses } from '../../constants';
import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export const POST = auth(async function POST(request: NextAuthRequest) {
	try {
		if (!request.auth) {
			return responses.notAuthenticated();
		}

		const body = await request.json();
		const { cardIds } = body;
		console.log('🚀 ~ POST REQUEST!!! ~ cardIds:', cardIds);

		const session = request.auth;
		const { user } = session;
		let cardIdsList: number[];

		if (cardIds) {
			cardIdsList = cardIds.split(',').map((id) => parseInt(id));
		} else {
			cardIdsList = [];
		}

		const cards = await prisma.card.findMany({
			where: {
				id: {
					in: cardIdsList,
				},
			},
		});

		return NextResponse.json(cards);
	} catch (error) {
		console.log('🚀 ~ POST ~ error:', error);
		return responses.badRequest(error.message);
	}
});
