import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FactionSModule } from './factions/factions.module'
import { FighterCategoriesModule } from './fighter-categories/fighter-categories.module'
import { FighterTypesModule } from './fighter-types/fighter-types.module';
import { TraitsModule } from './traits/traits.module';

@Module({
  imports: [FactionSModule, FighterCategoriesModule, FighterTypesModule, TraitsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
