import { Module } from '@nestjs/common'
import { FighterCategoriesService } from './fighter-categories.service'
import { FighterCategoriesController } from './fighter-categories.controller'

@Module({
  providers: [FighterCategoriesService],
  controllers: [FighterCategoriesController],
})
export class FighterCategoriesModule {}
