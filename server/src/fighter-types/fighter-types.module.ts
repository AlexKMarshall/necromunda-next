import { Module } from '@nestjs/common'
import { FighterTypesService } from './fighter-types.service'
import { FighterTypesController } from './fighter-types.controller'

@Module({
  providers: [FighterTypesService],
  controllers: [FighterTypesController],
})
export class FighterTypesModule {}
