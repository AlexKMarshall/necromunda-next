import { Module } from '@nestjs/common'
import { FactionsService } from './factions.service'
import { FactionsController } from './factions.controller'
import { PrismaService } from 'src/prisma.service'

@Module({
  providers: [FactionsService, PrismaService],
  controllers: [FactionsController],
})
export class FactionsModule {}
