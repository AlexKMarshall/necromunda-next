import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FactionSModule } from './factions/factions.module'

@Module({
  imports: [FactionSModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
