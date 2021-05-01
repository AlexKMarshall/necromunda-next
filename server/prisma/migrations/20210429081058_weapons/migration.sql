-- CreateTable
CREATE TABLE "Weapon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "const" INTEGER NOT NULL,
    "weaponTypeId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponStats" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "rangeShort" INTEGER,
    "rangeLong" INTEGER,
    "accuracyShort" INTEGER,
    "accuracyLong" INTEGER,
    "strength" INTEGER NOT NULL,
    "armourPenetration" INTEGER,
    "damage" INTEGER NOT NULL,
    "ammo" INTEGER,
    "weaponId" TEXT NOT NULL,
    "isSoldSeparately" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trait" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TraitsOnWeaponStats" (
    "weaponStatsId" TEXT NOT NULL,
    "traitId" TEXT NOT NULL,
    "modifier" INTEGER,

    PRIMARY KEY ("weaponStatsId","traitId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Weapon.name_unique" ON "Weapon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Weapon_weaponTypeId_unique" ON "Weapon"("weaponTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "WeaponType.name_unique" ON "WeaponType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Trait.name_unique" ON "Trait"("name");

-- AddForeignKey
ALTER TABLE "Weapon" ADD FOREIGN KEY ("weaponTypeId") REFERENCES "WeaponType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeaponStats" ADD FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraitsOnWeaponStats" ADD FOREIGN KEY ("weaponStatsId") REFERENCES "WeaponStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraitsOnWeaponStats" ADD FOREIGN KEY ("traitId") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
