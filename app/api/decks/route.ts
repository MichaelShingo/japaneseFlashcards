import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';
import { Deck } from '@prisma/client';
import { responses } from '../constants';

export const GET = auth(async function GET(req) {
    try {
        if (!req.auth) {
            return responses.notAuthenticated();
        }

        const session = req.auth;
        const deck: Deck[] = await prisma.deck.findMany({
            where: {
                userId: session.user.id,
            }
        });

        return NextResponse.json(deck);
    } catch (error) {
        return responses.badRequest(error.message);
    }
});
