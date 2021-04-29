import { Prisma, Trait } from '.prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
@Injectable()
export class TraitsService {
  constructor(private prisma: PrismaService) {}

  async trait(
    traitWhereUniqueInput: Prisma.TraitWhereUniqueInput,
  ): Promise<Trait | null> {
    return this.prisma.trait.findUnique({ where: traitWhereUniqueInput })
  }

  async traits({
    skip,
    take,
    cursor,
    where,
    orderBy,
  }: {
    skip?: number
    take?: number
    cursor?: Prisma.TraitWhereUniqueInput
    where?: Prisma.TraitWhereInput
    orderBy?: Prisma.TraitOrderByInput
  } = {}): Promise<Trait[]> {
    return this.prisma.trait.findMany({ skip, take, cursor, where, orderBy })
  }

  async create(trait: Prisma.TraitCreateInput): Promise<Trait> {
    return this.prisma.trait.create({ data: trait })
  }

  async delete(where: Prisma.TraitWhereUniqueInput): Promise<Trait> {
    return this.prisma.trait.delete({ where })
  }
}
