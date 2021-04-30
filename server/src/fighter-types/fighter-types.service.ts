import { FighterType, Prisma } from '.prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
export interface FighterTypeCreateInput
  extends Omit<
    Prisma.FighterTypeCreateInput,
    'fighterCategory' | 'fighterStats' | 'faction'
  > {
  faction: Prisma.FactionCreateNestedOneWithoutFighterTypesInput['connect']
  fighterCategory: Prisma.FighterCategoryCreateNestedOneWithoutFighterTypesInput['connect']
  fighterStats: Prisma.FighterStatsCreateNestedOneWithoutFighterTypeInput['create']
}

@Injectable()
export class FighterTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async fighterTypes() {
    return this.prisma.fighterType.findMany()
  }

  async create({
    faction,
    fighterCategory,
    fighterStats,
    ...fighterType
  }: FighterTypeCreateInput) {
    return this.prisma.fighterType.create({
      data: {
        ...fighterType,
        fighterStats: {
          create: fighterStats,
        },
        faction: {
          connect: faction,
        },
        fighterCategory: {
          connect: fighterCategory,
        },
      },
      include: { fighterStats: true, fighterCategory: true, faction: true },
    })
  }

  async delete(
    where: Prisma.FighterTypeWhereUniqueInput,
  ): Promise<FighterType> {
    return this.prisma.fighterType.delete({ where })
  }
}
