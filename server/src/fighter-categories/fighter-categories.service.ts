import { FighterCategory, Prisma } from '.prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class FighterCategoriesService {
  constructor(private prisma: PrismaService) {}

  async fighterCategories(): Promise<FighterCategory[]> {
    return this.prisma.fighterCategory.findMany()
  }

  async create(
    data: Prisma.FighterCategoryCreateWithoutFighterTypesInput,
  ): Promise<FighterCategory> {
    return this.prisma.fighterCategory.create({ data })
  }

  async delete(
    where: Prisma.FighterCategoryWhereUniqueInput,
  ): Promise<FighterCategory> {
    return this.prisma.fighterCategory.delete({ where })
  }
}
