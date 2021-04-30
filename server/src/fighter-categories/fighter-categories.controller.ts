import { FighterCategory } from '.prisma/client'
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { FighterCategoriesService } from './fighter-categories.service'

@Controller('fighter-categories')
export class FighterCategoriesController {
  constructor(
    private readonly fighterCategoriesService: FighterCategoriesService,
  ) {}

  @Get()
  async get(): Promise<FighterCategory[]> {
    return this.fighterCategoriesService.fighterCategories()
  }

  @Post()
  async create(@Body() fighterCategoryData: { name: FighterCategory['name'] }) {
    return this.fighterCategoriesService.create(fighterCategoryData)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.fighterCategoriesService.delete({ id })
  }
}
