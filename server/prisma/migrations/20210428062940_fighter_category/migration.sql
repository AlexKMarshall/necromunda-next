-- CreateTable
CREATE TABLE "FighterType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "factionId" TEXT NOT NULL,
    "fighterCategoryId" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "fighterStatsId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FighterStats" (
    "id" TEXT NOT NULL,
    "movement" INTEGER NOT NULL,
    "weaponSkill" INTEGER NOT NULL,
    "ballistickSkill" INTEGER NOT NULL,
    "strength" INTEGER NOT NULL,
    "toughness" INTEGER NOT NULL,
    "wounds" INTEGER NOT NULL,
    "initiative" INTEGER NOT NULL,
    "attacks" INTEGER NOT NULL,
    "leadership" INTEGER NOT NULL,
    "cool" INTEGER NOT NULL,
    "will" INTEGER NOT NULL,
    "intelligence" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FighterType.name_unique" ON "FighterType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FighterType_fighterStatsId_unique" ON "FighterType"("fighterStatsId");

-- AddForeignKey
ALTER TABLE "FighterType" ADD FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FighterType" ADD FOREIGN KEY ("fighterCategoryId") REFERENCES "FighterCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FighterType" ADD FOREIGN KEY ("fighterStatsId") REFERENCES "FighterStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
