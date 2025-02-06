import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';

export const GET = auth(function GET(req) {
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const json = req.json;
    console.log("🚀 ~ GET ~ json:", req.);

    return NextResponse.json(req.auth);



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

    if (!card) {
        return NextResponse.json({ status: 404, message: 'Card was not found.' });
    }

    // if (card.authorId !== Number(userId) && !card.deck.public) {
    //     return NextResponse.json({ status: 403, message: 'You are not authorized to view this card.' });
    // }

    return NextResponse.json({ status: 200, json: card });
});
