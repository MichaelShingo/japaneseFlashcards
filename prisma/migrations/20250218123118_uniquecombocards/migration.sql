/*
  Warnings:

  - A unique constraint covering the columns `[japanese,deckId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Card_japanese_deckId_key" ON "Card"("japanese", "deckId");
