import { Prisma, Trait } from '.prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
@Injectable()
export class TraitsService {
  constructor(private prisma: PrismaService) {}

  async traits(): Promise<Trait[]> {
    return this.prisma.trait.findMany()
  }

  async create(trait: Prisma.TraitCreateInput): Promise<Trait> {
    return this.prisma.trait.create({ data: trait })
  }

  async delete(where: Prisma.TraitWhereUniqueInput): Promise<Trait> {
    return this.prisma.trait.delete({ where })
  }
}
