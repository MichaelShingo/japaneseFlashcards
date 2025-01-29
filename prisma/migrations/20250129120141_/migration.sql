/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `Language` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `Language` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "identifier" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Language_identifier_key" ON "Language"("identifier");
