/*
  Warnings:

  - You are about to drop the `TraitsOnWeaponStats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TraitsOnWeaponStats" DROP CONSTRAINT "TraitsOnWeaponStats_traitId_fkey";

-- DropForeignKey
ALTER TABLE "TraitsOnWeaponStats" DROP CONSTRAINT "TraitsOnWeaponStats_weaponStatsId_fkey";

-- DropTable
DROP TABLE "TraitsOnWeaponStats";

-- CreateTable
CREATE TABLE "TraitOnWeaponStats" (
    "weaponStatsId" TEXT NOT NULL,
    "traitId" TEXT NOT NULL,
    "modifier" INTEGER,

    PRIMARY KEY ("weaponStatsId","traitId")
);

-- AddForeignKey
ALTER TABLE "TraitOnWeaponStats" ADD FOREIGN KEY ("weaponStatsId") REFERENCES "WeaponStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraitOnWeaponStats" ADD FOREIGN KEY ("traitId") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
