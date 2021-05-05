import { FighterType, Prisma } from '.prisma/client'
import { ConflictException, Injectable } from '@nestjs/common'
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
    return this.prisma.fighterType.findMany({
      include: { fighterStats: true, fighterCategory: true, faction: true },
    })
  }

  async create({
    faction,
    fighterCategory,
    fighterStats,
    ...fighterType
  }: FighterTypeCreateInput) {
    try {
      const createdFT = await this.prisma.fighterType.create({
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
      return createdFT
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `A fighter type with name "${fighterType.name} already exists`,
        )
      }
      throw error
    }
  }

  async delete(
    where: Prisma.FighterTypeWhereUniqueInput,
  ): Promise<FighterType> {
    return this.prisma.fighterType.delete({ where })
  }
}
