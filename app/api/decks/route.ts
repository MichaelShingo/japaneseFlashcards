import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';
import { Card, Deck } from '@prisma/client';
import { responses } from '../constants';

export interface ExtendedDeck extends Deck {
  totalCards: number;
  learnCount: number;
  reviewCount: number;
  studiedCount: number;
}

export const GET = auth(async function GET(req) {
  try {
    if (!req.auth) {
      return responses.notAuthenticated();
    }

    const { searchParams } = new URL(req.url);
    console.log("🚀 ~ GET ~ searchParams:", searchParams);

    const session = req.auth;
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
    console.log("🚀 ~ GET ~ decks:", decks);

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
