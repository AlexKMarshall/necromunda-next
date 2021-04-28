import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import {
  FighterTypesService,
  FighterTypeCreateInput,
} from './fighter-types.service'

@Controller('fighter-types')
export class FighterTypesController {
  constructor(private readonly fighterTypesService: FighterTypesService) {}

  @Get()
  async get() {
    return this.fighterTypesService.fighterTypes()
  }

  @Post()
  async create(@Body() fighterTypeData: FighterTypeCreateInput) {
    return this.fighterTypesService.create(fighterTypeData)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.fighterTypesService.delete({ id })
  }
}
