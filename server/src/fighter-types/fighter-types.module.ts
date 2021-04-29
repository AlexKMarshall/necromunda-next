import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { FighterTypesService } from './fighter-types.service'
import { FighterTypesController } from './fighter-types.controller'

@Module({
  providers: [FighterTypesService, PrismaService],
  controllers: [FighterTypesController],
})
export class FighterTypesModule {}
