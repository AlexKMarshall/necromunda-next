import { Module } from '@nestjs/common'
import { FactionsService } from './factions.service'
import { FactionsController } from './factions.controller'

@Module({
  providers: [FactionsService],
  controllers: [FactionsController],
})
export class FactionsModule {}
