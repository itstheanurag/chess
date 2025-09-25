/*
  Warnings:

  - Added the required column `fen` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Game" ADD COLUMN     "fen" TEXT NOT NULL;
