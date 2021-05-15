/*
  Warnings:

  - You are about to drop the column `isSoldSeparately` on the `WeaponStats` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CombiType" AS ENUM ('PRIMARY', 'SECONDARY');

-- AlterTable
ALTER TABLE "WeaponStats" DROP COLUMN "isSoldSeparately",
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "combiType" "CombiType";
