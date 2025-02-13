import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';
import { Deck } from '@prisma/client';
import { responses } from '../../constants';
import { NextAuthRequest } from '@/app/utils/common';

export const DELETE = auth(async function DELETE(request: NextAuthRequest, { params }: { params: { deckId: string; }; }) {
  try {
    if (!request.auth) {
      return responses.notAuthenticated();
    }

    const { deckId } = params;

    const deck: Deck = await prisma.deck.delete({
      where: {
        id: Number(deckId),
      }
    });
    return NextResponse.json(deck);
  } catch (error) {
    return responses.badRequest(error.message);
  }
});

export const PATCH = auth(async function PATCH(request: NextAuthRequest, { params }: { params: { deckId: string; }; }) {
  try {
    if (!request.auth) {
      return responses.notAuthenticated();
    }

    const body = await request.json();
    const { title, description, isPublic } = body;

    const { deckId } = params;

    const deck = await prisma.deck.update({
      where: {
        id: Number(deckId),
      },
      data: {
        title,
        description,
        isPublic,
      }
    });

    return NextResponse.json(deck);
  } catch (error) {
    return responses.badRequest(error.message);
  }
});
