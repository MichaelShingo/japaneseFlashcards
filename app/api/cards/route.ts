import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';
import { Card, Deck } from '@prisma/client';
import { NextAuthRequest } from '@/app/utils/common';
import { responses } from '../constants';


export const GET = auth(async function GET(request: NextAuthRequest) {
  try {
    if (!request.auth) {
      return responses.notAuthenticated();
    }

    const { searchParams } = new URL(request.url);
    const dueForStudy = Boolean(searchParams.get('dueForStudy'));
    const deckId = Number(searchParams.get('deckId'));

    const cards: Card[] = await prisma.card.findMany({
      where: {
        deckId: deckId ? deckId : undefined,
        nextStudy: {
          lt: dueForStudy ? new Date() : undefined
        }
      },
    });

    return NextResponse.json(cards);
  } catch (error) {
    return responses.badRequest('Failed to create deck.');
  }
});