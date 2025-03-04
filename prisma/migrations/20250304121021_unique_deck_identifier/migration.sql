/*
  Warnings:

  - A unique constraint covering the columns `[title,userId]` on the table `Deck` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Deck_title_userId_key" ON "Deck"("title", "userId");
