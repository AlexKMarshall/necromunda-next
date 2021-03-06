import faker from 'faker'
import {
  Faction,
  FighterCategory,
  FighterStats,
  FighterType,
  Skill,
  SkillType,
  Trait,
} from 'schemas'

export function buildFaction(overrides: Partial<Faction> = {}): Faction {
  return {
    id: faker.datatype.uuid(),
    name: faker.unique(faker.company.bsNoun),
    ...overrides,
  }
}

export function buildFighterCategory(
  overrides: Partial<FighterCategory> = {}
): FighterCategory {
  return {
    id: faker.datatype.uuid(),
    name: faker.unique(faker.company.bsBuzz),
    ...overrides,
  }
}

export function buildTrait(overrides: Partial<Trait> = {}): Trait {
  return {
    id: faker.datatype.uuid(),
    name: faker.unique(faker.company.bsAdjective),
    ...overrides,
  }
}

function buildFighterStats(
  overrides: Partial<FighterStats> = {}
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

export function buildFighterType({
  faction: factionOverrides,
  fighterCategory: fcOverrides,
  fighterStats: statsOverrides,
  ...overrides
}: Partial<FighterType> = {}): FighterType {
  const faction = buildFaction(factionOverrides)
  const fighterCategory = buildFighterCategory(fcOverrides)
  const fighterStats = buildFighterStats(statsOverrides)

  return {
    id: faker.datatype.uuid(),
    name: faker.unique(faker.company.catchPhraseNoun),
    cost: faker.datatype.number({ min: 25, max: 150 }),
    faction,
    fighterCategory,
    fighterStats,
    ...overrides,
  }
}

export function buildSkillType(overrides: Partial<SkillType> = {}): SkillType {
  return {
    id: faker.datatype.uuid(),
    name: faker.unique(faker.hacker.adjective),
    ...overrides,
  }
}

export function buildSkill({
  type: skillTypeOverrides,
  ...overrides
}: Partial<Skill> = {}): Skill {
  const skillType = buildSkillType(skillTypeOverrides)

  return {
    id: faker.datatype.uuid(),
    name: faker.unique(faker.hacker.noun),
    type: skillType,
    ...overrides,
  }
}
