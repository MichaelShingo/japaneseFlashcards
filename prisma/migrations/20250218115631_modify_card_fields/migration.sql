/*
  Warnings:

  - You are about to drop the column `back` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `front` on the `Card` table. All the data in the column will be lost.
  - Added the required column `english` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `japanese` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" RENAME COLUMN "front" TO "japanese";
ALTER TABLE "Card" RENAME COLUMN "back" TO "english";




