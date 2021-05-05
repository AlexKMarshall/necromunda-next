import {
  Faction,
  FighterCategory,
  FighterStats,
  Prisma,
  Trait,
} from '@prisma/client'
import * as faker from 'faker'
import { FighterTypeCreateInput } from 'src/fighter-types/fighter-types.service'

export function buildFaction(overrides: Partial<Faction> = {}): Faction {
  return {
    id: faker.datatype.uuid(),
    name: faker.company.bsNoun(),
    ...overrides,
  }
}

export function buildCreateFactionDTO(
  overrides: Partial<Prisma.FactionCreateWithoutFighterTypesInput> = {},
): Prisma.FactionCreateWithoutFighterTypesInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...faction } = buildFaction(overrides)
  return faction
}

export function buildFighterCategory(
  overrides: Partial<FighterCategory> = {},
): FighterCategory {
  return {
    id: faker.datatype.uuid(),
    name: faker.company.bsBuzz(),
    ...overrides,
  }
}

export function buildCreateFighterCategoryDto(
  overrides: Partial<Prisma.FighterCategoryCreateWithoutFighterTypesInput> = {},
): Prisma.FighterCategoryCreateWithoutFighterTypesInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...fighterCategory } = buildFighterCategory(overrides)
  return fighterCategory
}

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

function buildFighterStats(
  overrides: Partial<FighterStats> = {},
): FighterStats {
  return {
    id: faker.datatype.uuid(),
    movement: faker.datatype.number({ min: 3, max: 6 }),
    weaponSkill: faker.datatype.number({ min: 3, max: 6 }),
    ballisticSkill: faker.datatype.number({ min: 3, max: 6 }),
    strength: faker.datatype.number({ min: 3, max: 6 }),
    toughness: faker.datatype.number({ min: 3, max: 6 }),
    wounds: faker.datatype.number({ min: 1, max: 4 }),
    initiative: faker.datatype.number({ min: 3, max: 6 }),
    attacks: faker.datatype.number({ min: 1, max: 4 }),
    leadership: faker.datatype.number({ min: 6, max: 11 }),
    cool: faker.datatype.number({ min: 6, max: 11 }),
    will: faker.datatype.number({ min: 6, max: 11 }),
    intelligence: faker.datatype.number({ min: 6, max: 11 }),
    ...overrides,
  }
}

const fullFT = Prisma.validator<Prisma.FighterTypeArgs>()({
  include: { faction: true, fighterCategory: true, fighterStats: true },
})

type FullFT = Prisma.FighterTypeGetPayload<typeof fullFT>

export function buildFighterType({
  faction: factionOverrides,
  fighterCategory: fcOverrides,
  fighterStats: statsOverrides,
  ...overrides
}: Partial<FullFT> = {}): FullFT {
  const faction = buildFaction(factionOverrides)
  const fighterCategory = buildFighterCategory(fcOverrides)
  const fighterStats = buildFighterStats(statsOverrides)

  return {
    id: faker.datatype.uuid(),
    name: faker.company.catchPhraseNoun(),
    cost: faker.datatype.number({ min: 25, max: 150 }),
    faction,
    factionId: faction.id,
    fighterCategory,
    fighterCategoryId: fighterCategory.id,
    fighterStats,
    fighterStatsId: fighterStats.id,
    ...overrides,
  }
}

export function buildCreateFighterTypeDto(
  overrides: Partial<FullFT> = {},
): FighterTypeCreateInput {
  const {
    name,
    cost,
    faction,
    fighterCategory,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fighterStats: { id, ...fighterStats },
  } = buildFighterType(overrides)

  return {
    name,
    cost,
    faction: { id: faction.id },
    fighterCategory: { id: fighterCategory.id },
    fighterStats,
  }
}
