import { Faction, Prisma } from '@prisma/client'
import { ConflictException, Injectable } from '@nestjs/common'
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
    try {
      const createdFaction = await this.prisma.faction.create({ data: faction })
      return createdFaction
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `A faction with name "${faction.name}" already exists`,
        )
      }
      throw error
    }
  }

  async delete(where: Prisma.FactionWhereUniqueInput): Promise<Faction> {
    return this.prisma.faction.delete({ where })
  }
}
