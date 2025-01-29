/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Language` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "nextStudy" DROP NOT NULL,
ALTER COLUMN "srsLevel" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");
