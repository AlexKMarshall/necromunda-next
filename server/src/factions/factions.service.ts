import { Faction, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class FactionsService {
  constructor(private prisma: PrismaService) {}

  async faction(
    factionWhereUniqueInput: Prisma.FactionWhereUniqueInput,
  ): Promise<Faction | null> {
    return this.prisma.faction.findUnique({ where: factionWhereUniqueInput })
  }

  async factions(
    params: {
      skip?: number
      take?: number
      cursor?: Prisma.FactionWhereUniqueInput
      where?: Prisma.FactionWhereInput
      orderBy?: Prisma.FactionOrderByInput
    } = {},
  ): Promise<Faction[]> {
    return this.prisma.faction.findMany(params)
  }

  async create(faction: Prisma.FactionCreateInput): Promise<Faction> {
    return this.prisma.faction.create({ data: faction })
  }

  async update({
    where,
    data: data,
  }: Prisma.FactionUpdateArgs): Promise<Faction> {
    return this.prisma.faction.update({ where, data })
  }

  async remove(where: Prisma.FactionWhereUniqueInput): Promise<Faction> {
    return this.prisma.faction.delete({ where })
  }
}
