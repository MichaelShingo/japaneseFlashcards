/*
  Warnings:

  - You are about to drop the column `nextStudy` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `srsLevel` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "nextStudy",
DROP COLUMN "srsLevel",
ADD COLUMN     "displayEnglishNextStudy" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displayEnglishSrsLevel" INTEGER DEFAULT 0,
ADD COLUMN     "displayJapaneseNextStudy" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displayJapaneseSrsLevel" INTEGER DEFAULT 0;
