import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';
import { Card, Deck } from '@prisma/client';
import { responses } from '../constants';
import { NextAuthRequest } from '@/app/utils/common';

export interface ExtendedDeck extends Deck {
  totalCards: number;
  learnCount: number;
  reviewCount: number;
  studiedCount: number;
}

export const GET = auth(async function GET(request: NextAuthRequest) {
  try {
    if (!request.auth) {
      return responses.notAuthenticated();
    }

    const { searchParams } = new URL(request.url);

    const session = request.auth;
    const decks = await prisma.deck.findMany({
      where: {
        userId: session.user.id,
        title: {
          contains: searchParams.get('search'),
          mode: 'insensitive',
        }
      },
      include: {
        cards: true,
      }
    });

    const result: ExtendedDeck[] = [];
    const now = new Date();

    for (const deck of decks) {
      const totalCards = deck.cards.length;
      const dueCards = deck.cards.filter((card: Card) => card.nextStudy < now);
      const learnCount = dueCards.filter((card: Card) => card.srsLevel === 0).length;
      const reviewCount = dueCards.length - learnCount;
      const studiedCount = deck.cards.filter((card: Card) => card.srsLevel > 0).length;
      result.push({
        ...deck,
        totalCards,
        learnCount,
        reviewCount,
        studiedCount,
      });
    };
    return NextResponse.json(result);
  } catch (error) {
    return responses.badRequest(error.message);
  }
});

export const POST = auth(async function POST(request: NextAuthRequest) {
  try {
    if (!request.auth) {
      return responses.notAuthenticated();
    }

    const body = await request.json();
    console.log("🚀 ~ POST ~ body:", body);
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
      }
    });

    return NextResponse.json(deck);

  } catch (error) {
    return responses.badRequest(error.message);
  }
});


