import { languages } from './seedData/languages';
import { studyModes, studyModesMap } from './seedData/studyModes';
import { decks } from './seedData/decks';
import { cards } from './seedData/cards';
import { prisma } from './prisma';

async function main() {
  for (const language of languages) {
    await prisma.language.upsert({
      where: { identifier: language.identifier },
      update: { name: language.name },
      create: { identifier: language.identifier, name: language.name },
    });
  }

  for (const studyMode of studyModes) {
    await prisma.studyMode.upsert({
      where: { identifier: studyMode.identifier },
      update: { name: studyMode.name, description: studyMode.description, type: studyMode.type },
      create: { identifier: studyMode.identifier, name: studyMode.name, description: studyMode.description, type: studyMode.type },
    });
  }

  const newStudyModes = await prisma.studyMode.findMany();
  const japaneseRecognition = newStudyModes.find((mode) => mode.identifier === studyModesMap.japaneseRecognition);

  for (const deck of decks) {
    const deckCreateUpdate = {
      title: deck.title,
      description: deck.description,
      isPublic: deck.isPublic,
      userId: deck.userId,
      studyModeId: japaneseRecognition.id,
    };
    await prisma.deck.upsert({
      where: { id: deck.id },
      update: deckCreateUpdate,
      create: deckCreateUpdate,
    });
  }

  const newDecks = await prisma.deck.findMany();
  const musicDeck = newDecks.find((deck) => deck.title === 'Music');
  console.log("🚀 ~ main ~ musicDeck:", musicDeck);

  for (const card of cards) {
    const cardCreateUpdate = {
      front: card.front,
      back: card.back,
      hint: card.hint,
      userId: card.userId,
      deckId: musicDeck.id,
      srsLevel: card.srsLevel,
      nextStudy: card.nextStudy
    };
    await prisma.card.upsert({
      where: { id: card.id },
      update: cardCreateUpdate,
      create: cardCreateUpdate,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });