import { FighterCategory, Prisma } from '.prisma/client'
import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class FighterCategoriesService {
  constructor(private prisma: PrismaService) {}

  async fighterCategories(): Promise<FighterCategory[]> {
    return this.prisma.fighterCategory.findMany()
  }

  async create(
    fighterCategory: Prisma.FighterCategoryCreateWithoutFighterTypesInput,
  ): Promise<FighterCategory> {
    try {
      const fc = await this.prisma.fighterCategory.create({
        data: fighterCategory,
      })
      return fc
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `A fighter category with name "${fighterCategory.name}" already exists`,
        )
      }

      throw error
    }
  }

  async delete(
    where: Prisma.FighterCategoryWhereUniqueInput,
  ): Promise<FighterCategory> {
    return this.prisma.fighterCategory.delete({ where })
  }
}
