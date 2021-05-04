import { Faction, FighterCategory, Prisma } from '@prisma/client'
import * as faker from 'faker'

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
