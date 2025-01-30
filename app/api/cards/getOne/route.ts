import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const cardId = searchParams.get('cardId');

    const card = await prisma.card.findUnique({
        where: {
            id: Number(cardId),
        },
        include: {
            deck: {
                select: {
                    public: true,
                },
            }
        }
    });

    console.log("🚀 ~ GET ~ card:", card);

    if (!card) {
        return NextResponse.json({ status: 404, message: 'Card was not found.' });
    }

    if (card.authorId !== Number(userId) && !card.deck.public) {
        return NextResponse.json({ status: 403, message: 'You are not authorized to view this card.' });
    }

    return NextResponse.json({ status: 200, json: card });
};