/*
  Warnings:

  - Added the required column `type` to the `StudyMode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudyMode" ADD COLUMN     "type" TEXT NOT NULL;
