import { Module } from '@nestjs/common'
import { FighterCategoriesService } from './fighter-categories.service'
import { FighterCategoriesController } from './fighter-categories.controller'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  providers: [FighterCategoriesService, PrismaService],
  controllers: [FighterCategoriesController],
})
export class FighterCategoriesModule {}
