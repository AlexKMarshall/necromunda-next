import { FighterCategory } from '.prisma/client'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { FighterCategoriesService } from './fighter-categories.service'

@Controller('fighter-categories')
export class FighterCategoriesController {
  constructor(
    private readonly fighterCategoriesService: FighterCategoriesService,
  ) {}

  @Get()
  async getAllFighterCategories(): Promise<FighterCategory[]> {
    return this.fighterCategoriesService.fighterCategories()
  }

  @Post()
  async createFighterCategory(
    @Body() fighterCategoryData: { name: FighterCategory['name'] },
  ) {
    return this.fighterCategoriesService.createFighterCategory(
      fighterCategoryData,
    )
  }
}
