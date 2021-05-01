import { Faction, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class FactionsService {
  constructor(private prisma: PrismaService) {}

  async factions(): Promise<Faction[]> {
    return this.prisma.faction.findMany()
  }

  async create(
    faction: Prisma.FactionCreateWithoutFighterTypesInput,
  ): Promise<Faction> {
    return this.prisma.faction.create({ data: faction })
  }

  async delete(where: Prisma.FactionWhereUniqueInput): Promise<Faction> {
    return this.prisma.faction.delete({ where })
  }
}
