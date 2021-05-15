import { WeaponType } from '.prisma/client'
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { WeaponTypesService } from './weapon-types.service'

@Controller('weapon-types')
export class WeaponTypesController {
  constructor(private readonly weaponTypesService: WeaponTypesService) {}

  @Get()
  async get(): Promise<WeaponType[]> {
    return this.weaponTypesService.weaponTypes()
  }

  @Post()
  async create(@Body() weaponTypeDto: { name: WeaponType['name'] }) {
    return this.weaponTypesService.create(weaponTypeDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: WeaponType['id']) {
    return this.weaponTypesService.delete(id)
  }
}
