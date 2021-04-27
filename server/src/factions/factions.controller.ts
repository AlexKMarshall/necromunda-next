import { Faction } from '.prisma/client'
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
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

  @Delete(':id')
  async removeFaction(@Param('id') id: string) {
    return this.factionsService.deleteFaction({ id })
  }
}
