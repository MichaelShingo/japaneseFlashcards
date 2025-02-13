/*
  Warnings:

  - You are about to drop the column `sourceLanguageId` on the `Deck` table. All the data in the column will be lost.
  - You are about to drop the column `studyLanguageId` on the `Deck` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_sourceLanguageId_fkey";

-- DropForeignKey
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_studyLanguageId_fkey";

-- AlterTable
ALTER TABLE "Deck" DROP COLUMN "sourceLanguageId",
DROP COLUMN "studyLanguageId";
