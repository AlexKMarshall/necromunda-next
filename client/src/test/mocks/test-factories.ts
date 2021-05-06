import faker from 'faker'
import { Faction, FighterCategory, Trait } from 'schemas'

export function buildFaction(overrides: Partial<Faction> = {}): Faction {
  return {
    id: faker.datatype.uuid(),
    name: faker.company.bsNoun(),
    ...overrides,
  }
}

export function buildFighterCategory(
  overrides: Partial<FighterCategory> = {}
): FighterCategory {
  return {
    id: faker.datatype.uuid(),
    name: faker.company.bsBuzz(),
    ...overrides,
  }
}

export function buildTrait(overrides: Partial<Trait> = {}): Trait {
  return {
    id: faker.datatype.uuid(),
    name: faker.company.bsAdjective(),
    ...overrides,
  }
}
