import { DeepPartial } from 'utility-types'
import { Prisma, Trait, WeaponStats, WeaponType } from '@prisma/client'
import * as faker from 'faker'
import { WeaponCreateInput } from 'src/weapons/weapons.service'

export function buildTrait(overrides: Partial<Trait> = {}): Trait {
  return {
    id: faker.datatype.uuid(),
    name: faker.company.bsAdjective(),
    ...overrides,
  }
}

export function buildCreateTraitDto(
  overrides: Partial<Prisma.TraitCreateWithoutWeaponStatsInput> = {},
): Prisma.TraitCreateWithoutWeaponStatsInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...trait } = buildTrait(overrides)
  return trait
}

export function buildWeaponType(
  overrides: Partial<WeaponType> = {},
): WeaponType {
  return {
    id: faker.datatype.uuid(),
    name: faker.unique(faker.hacker.adjective),
    ...overrides,
  }
}

export function buildCreateWeaponTypeDto(
  overrides: Partial<Prisma.WeaponTypeCreateWithoutWeaponsInput> = {},
): Prisma.WeaponTypeCreateWithoutWeaponsInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...weaponType } = buildWeaponType(overrides)
  return weaponType
}

const fullWeaponStats = Prisma.validator<Prisma.WeaponStatsArgs>()({
  include: { traits: { include: { trait: true } } },
})

type FullWeaponStats = Prisma.WeaponStatsGetPayload<typeof fullWeaponStats>

function buildWeaponStats(
  weaponId: WeaponStats['weaponId'],
  {
    id,
    traits: traitsOverrides,
    ...overrides
  }: DeepPartial<FullWeaponStats> = {},
): FullWeaponStats {
  const weaponStatsId = id ?? faker.datatype.uuid()

  const traitsWithoutWeaponStatsId: Array<typeof traitsOverrides[number]> =
    traitsOverrides ?? new Array(faker.datatype.number({ min: 0, max: 3 }))

  const traits = traitsWithoutWeaponStatsId.map((t) => ({
    ...buildTraitOnWeaponStatWithoutWeaponStatId(t),
    weaponStatsId,
  }))

  return {
    weaponId,
    id: weaponStatsId,
    description: faker.lorem.word(),
    rangeShort: faker.datatype.number({ min: 6, max: 12 }),
    rangeLong: faker.datatype.number({ min: 6, max: 36 }),
    accuracyShort: faker.datatype.number({ min: -3, max: 3 }),
    accuracyLong: faker.datatype.number({ min: -3, max: 3 }),
    strength: faker.datatype.number({ max: 8 }),
    armourPenetration: faker.datatype.number({ min: -4, max: 0 }),
    damage: faker.datatype.number({ max: 6 }),
    ammo: faker.datatype.number({ max: 6 }),
    isDefault: true,
    isAmmo: false,
    combiType: null,
    traits,
    ...overrides,
  }
}

type TraitOnWeaponStatsWithoutWeaponStatId = Omit<
  FullWeaponStats['traits'][number],
  'weaponStatsId'
>

function buildTraitOnWeaponStatWithoutWeaponStatId({
  trait: traitOverride,
  ...overrides
}: DeepPartial<TraitOnWeaponStatsWithoutWeaponStatId> = {}): TraitOnWeaponStatsWithoutWeaponStatId {
  const trait = buildTrait(traitOverride)
  return {
    modifier: faker.datatype.number({ max: 3 }),
    trait,
    traitId: trait.id,
    ...overrides,
  }
}

const fullWeapon = Prisma.validator<Prisma.WeaponArgs>()({
  include: {
    weaponType: true,
    weaponStats: {
      include: {
        traits: {
          include: {
            trait: true,
          },
        },
      },
    },
  },
})

type FullWeapon = Prisma.WeaponGetPayload<typeof fullWeapon>

export function buildWeapon({
  id,
  weaponStats: statsOverrides,
  weaponType: typeOverrides,
  ...overrides
}: DeepPartial<FullWeapon> = {}): FullWeapon {
  const weaponId = id ?? faker.datatype.uuid()
  const type = buildWeaponType(typeOverrides)
  const stats = (statsOverrides ?? [undefined]).map((ws) =>
    buildWeaponStats(weaponId, ws),
  )

  return {
    id: weaponId,
    name: faker.commerce.productName(),
    weaponType: type,
    weaponTypeId: type.id,
    weaponStats: stats,
    ...overrides,
  }
}

export function buildCreateWeaponDto(
  overrides: DeepPartial<FullWeapon> = {},
): WeaponCreateInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, weaponType, weaponTypeId, weaponStats, ...weapon } = buildWeapon(
    overrides,
  )

  return {
    ...weapon,
    weaponType: { id: weaponType.id },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    weaponStats: weaponStats.map(({ weaponId, id, traits, ...ws }) => ({
      ...ws,
      traits: traits.map(({ modifier, trait }) => ({
        modifier,
        trait: { id: trait.id },
      })),
    })),
  }
}
