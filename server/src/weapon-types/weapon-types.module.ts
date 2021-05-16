import { Module } from '@nestjs/common'
import { WeaponTypesService } from './weapon-types.service'
import { WeaponTypesController } from './weapon-types.controller'

@Module({
  providers: [WeaponTypesService],
  controllers: [WeaponTypesController],
})
export class WeaponTypesModule {}
