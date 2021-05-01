import { Trait } from '.prisma/client'
import { Body, Controller, Get, Post, Delete, Param } from '@nestjs/common'
import { TraitsService } from './traits.service'

@Controller('traits')
export class TraitsController {
  constructor(private readonly traitsService: TraitsService) {}

  @Get()
  async get(): Promise<Trait[]> {
    return this.traitsService.traits()
  }

  @Post()
  async create(@Body() traitData: { name: Trait['name'] }) {
    return this.traitsService.create(traitData)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.traitsService.delete({ id })
  }
}
