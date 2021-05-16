import { ConflictException, Injectable } from '@nestjs/common'
import { Prisma, Weapon } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

export type WeaponCreateInput = Omit<
  Prisma.WeaponCreateInput,
  'weaponType' | 'weaponStats'
> & {
  weaponType: Prisma.WeaponTypeCreateNestedOneWithoutWeaponsInput['connect']
  weaponStats: WeaponStatsCreateInput[]
}

type WeaponStatsCreateInput = Omit<
  Prisma.WeaponStatsCreateWithoutWeaponInput,
  'traits'
> & {
  traits: TraitOnWeaponStatsCreateInput[]
}

type TraitOnWeaponStatsCreateInput = Omit<
  Prisma.TraitOnWeaponStatsCreateInput,
  'weaponStats' | 'trait'
> & {
  trait: Prisma.TraitCreateNestedOneWithoutWeaponStatsInput['connect']
}

@Injectable()
export class WeaponsService {
  constructor(private readonly prisma: PrismaService) {}

  async weapons() {
    return this.prisma.weapon.findMany({
      include: {
        weaponType: true,
        weaponStats: { include: { traits: { include: { trait: true } } } },
      },
    })
  }

  async create({ weaponType, weaponStats, ...weapon }: WeaponCreateInput) {
    try {
      return await this.prisma.weapon.create({
        data: {
          ...weapon,
          weaponType: {
            connect: weaponType,
          },
          weaponStats: {
            create: weaponStats.map(({ traits, ...ws }) => ({
              ...ws,
              traits: {
                create: traits.map(({ trait, ...ts }) => ({
                  ...ts,
                  trait: {
                    connect: trait,
                  },
                })),
              },
            })),
          },
        },
        include: {
          weaponType: true,
          weaponStats: { include: { traits: { include: { trait: true } } } },
        },
      })
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `A weapon with name "${weapon.name} already exists`,
        )
      }
      throw error
    }
  }

  async delete(weaponId: Weapon['id']) {
    const { weaponStats } = await this.prisma.weapon.findUnique({
      where: { id: weaponId },
      include: {
        weaponType: true,
        weaponStats: { include: { traits: { include: { trait: true } } } },
      },
    })

    const weaponStatsIds = weaponStats.map(({ id }) => id)

    await this.prisma.traitOnWeaponStats.deleteMany({
      where: {
        weaponStatsId: {
          in: weaponStatsIds,
        },
      },
    })

    await this.prisma.weaponStats.deleteMany({
      where: {
        weaponId: weaponId,
      },
    })

    return this.prisma.weapon.delete({ where: { id: weaponId } })
  }
}
