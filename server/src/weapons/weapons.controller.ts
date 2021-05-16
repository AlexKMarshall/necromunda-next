import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { Weapon } from '@prisma/client'
import { WeaponCreateInput, WeaponsService } from './weapons.service'

@Controller('weapons')
export class WeaponsController {
  constructor(private readonly weaponsService: WeaponsService) {}

  @Get()
  async ge() {
    return this.weaponsService.weapons()
  }

  @Post()
  async create(@Body() weaponDto: WeaponCreateInput) {
    return this.weaponsService.create(weaponDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: Weapon['id']) {
    return this.weaponsService.delete(id)
  }
}
