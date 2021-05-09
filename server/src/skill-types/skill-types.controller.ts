import { SkillType } from '.prisma/client'
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { SkillTypesService } from './skill-types.service'

@Controller('skill-types')
export class SkillTypesController {
  constructor(private readonly skillTypesService: SkillTypesService) {}

  @Get()
  async get(): Promise<SkillType[]> {
    return this.skillTypesService.skillTypes()
  }

  @Post()
  async create(@Body() skillTypeDto: { name: SkillType['name'] }) {
    return this.skillTypesService.create(skillTypeDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: SkillType['id']) {
    return this.skillTypesService.delete(id)
  }
}
