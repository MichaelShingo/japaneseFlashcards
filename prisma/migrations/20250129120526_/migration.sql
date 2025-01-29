/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `StudyMode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `StudyMode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudyMode" ADD COLUMN     "identifier" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudyMode_identifier_key" ON "StudyMode"("identifier");
