import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TraitsService } from './traits.service'
import { TraitsController } from './traits.controller'

@Module({
  providers: [TraitsService, PrismaService],
  controllers: [TraitsController],
})
export class TraitsModule {}
