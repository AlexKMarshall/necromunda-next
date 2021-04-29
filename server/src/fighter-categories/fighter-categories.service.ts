import { FighterCategory, Prisma } from '.prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class FighterCategoriesService {
  constructor(private prisma: PrismaService) {}

  async fighterCategory(
    fighterCategoryWhereUniqueInput: Prisma.FighterCategoryWhereUniqueInput,
  ): Promise<FighterCategory> {
    return this.prisma.fighterCategory.findUnique({
      where: fighterCategoryWhereUniqueInput,
    })
  }

  async fighterCategories(
    params: {
      skip?: number
      take?: number
      cursor?: Prisma.FighterCategoryWhereUniqueInput
      where?: Prisma.FighterCategoryWhereInput
      orderBy?: Prisma.FighterCategoryOrderByInput
    } = {},
  ): Promise<FighterCategory[]> {
    return this.prisma.fighterCategory.findMany(params)
  }

  async create(
    data: Prisma.FighterCategoryCreateInput,
  ): Promise<FighterCategory> {
    return this.prisma.fighterCategory.create({ data })
  }

  async update(
    params: Prisma.FighterCategoryUpdateArgs,
  ): Promise<FighterCategory> {
    return this.prisma.fighterCategory.update(params)
  }

  async remove(
    where: Prisma.FighterCategoryWhereUniqueInput,
  ): Promise<FighterCategory> {
    return this.prisma.fighterCategory.delete({ where })
  }
}
