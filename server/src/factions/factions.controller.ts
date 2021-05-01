import { Faction } from '.prisma/client'
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { FactionsService } from './factions.service'

@Controller('factions')
export class FactionsController {
  constructor(private readonly factionsService: FactionsService) {}

  @Get()
  async get(): Promise<Faction[]> {
    return this.factionsService.factions()
  }

  @Post()
  async create(@Body() factionData: { name: Faction['name'] }) {
    return this.factionsService.create(factionData)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.factionsService.delete({ id })
  }
}
