import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FactionSModule } from './factions/factions.module'
import { FighterCategoriesModule } from './fighter-categories/fighter-categories.module'

@Module({
  imports: [FactionSModule, FighterCategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
