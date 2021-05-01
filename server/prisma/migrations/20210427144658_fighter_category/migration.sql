-- CreateTable
CREATE TABLE "FighterCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FighterCategory.name_unique" ON "FighterCategory"("name");
