import faker from 'faker'
import { Faction, FighterCategory } from 'schemas'

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
