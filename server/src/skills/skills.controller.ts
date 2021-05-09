import { Skill } from '.prisma/client'
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { SkillCreateInput, SkillsService } from './skills.service'

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async get() {
    return this.skillsService.skills()
  }

  @Post()
  async create(@Body() skillDto: SkillCreateInput) {
    return this.skillsService.create(skillDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: Skill['id']) {
    return this.skillsService.delete(id)
  }
}
