import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';
import { Deck, StudyMode } from '@prisma/client';
import { responses } from '../constants';

export interface ExtendedDeck extends Deck {
  totalCards: number;
  learnCount: number;
  reviewCount: number;
  studiedCount: number;
}

export const GET = auth(async function GET(req) {
  try {
    const studyModes: StudyMode[] = await prisma.studyMode.findMany();

    return NextResponse.json(studyModes);
  } catch (error) {
    return responses.badRequest(error.message);
  }
});
