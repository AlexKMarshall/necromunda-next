/*
  Warnings:

  - You are about to drop the column `ballistickSkill` on the `FighterStats` table. All the data in the column will be lost.
  - Added the required column `ballisticSkill` to the `FighterStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FighterStats" DROP COLUMN "ballistickSkill",
ADD COLUMN     "ballisticSkill" INTEGER NOT NULL;
