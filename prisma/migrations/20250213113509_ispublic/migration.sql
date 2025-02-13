/*
  Warnings:

  - You are about to drop the column `public` on the `Deck` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deck" DROP COLUMN "public",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;
