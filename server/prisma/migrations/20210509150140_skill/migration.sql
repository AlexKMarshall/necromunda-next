-- AlterTable
ALTER TABLE "WeaponStats" ADD COLUMN     "isAmmo" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SkillType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SkillType.name_unique" ON "SkillType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill.name_unique" ON "Skill"("name");

-- AddForeignKey
ALTER TABLE "Skill" ADD FOREIGN KEY ("typeId") REFERENCES "SkillType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
