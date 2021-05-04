import { Module } from '@nestjs/common'
import { FactionsModule } from './factions/factions.module'
import { FighterCategoriesModule } from './fighter-categories/fighter-categories.module'
import { FighterTypesModule } from './fighter-types/fighter-types.module'
import { TraitsModule } from './traits/traits.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    FactionsModule,
    FighterCategoriesModule,
    FighterTypesModule,
    TraitsModule,
    PrismaModule,
  ],
})
export class AppModule {}
