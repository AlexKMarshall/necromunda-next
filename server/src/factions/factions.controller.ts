import { Faction } from '.prisma/client'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { FactionsService } from './factions.service'

@Controller('factions')
export class FactionsController {
  constructor(private readonly factionsService: FactionsService) {}

  @Get()
  async getAllFactions(): Promise<Faction[]> {
    return this.factionsService.factions()
  }

  @Post()
  async createFaction(@Body() factionData: { name: Faction['name'] }) {
    return this.factionsService.createFaction(factionData)
  }
}
