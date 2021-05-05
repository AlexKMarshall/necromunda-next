import { Prisma, Trait } from '.prisma/client'
import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
@Injectable()
export class TraitsService {
  constructor(private prisma: PrismaService) {}

  async traits(): Promise<Trait[]> {
    return this.prisma.trait.findMany()
  }

  async create(trait: Prisma.TraitCreateInput): Promise<Trait> {
    try {
      const createdTrait = await this.prisma.trait.create({ data: trait })
      return createdTrait
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `A trait with name "${trait.name}" already exists`,
        )
      }
      throw error
    }
  }

  async delete(where: Prisma.TraitWhereUniqueInput): Promise<Trait> {
    return this.prisma.trait.delete({ where })
  }
}
