import { Prisma, WeaponType } from '.prisma/client'
import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class WeaponTypesService {
  constructor(private prisma: PrismaService) {}

  async weaponTypes() {
    return this.prisma.weaponType.findMany()
  }

  async create(weaponType: Prisma.WeaponTypeCreateWithoutWeaponsInput) {
    try {
      return await this.prisma.weaponType.create({ data: weaponType })
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `A Weapon Type with name "${weaponType.name}" already exists`,
        )
      }
      throw error
    }
  }

  async delete(weaponTypeId: WeaponType['id']) {
    return this.prisma.weaponType.delete({ where: { id: weaponTypeId } })
  }
}
