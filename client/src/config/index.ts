export const queryKeys = {
  factions: 'factions',
  fighterCategories: 'fighterCategories',
  fighterTypes: 'fighterTypes',
  skillTypes: 'skillTypes',
  skills: 'skills',
  traits: 'traits',
}

export const endpoints = {
  factions: 'factions',
  fighterCategories: 'fighter-categories',
  fighterTypes: 'fighter-types',
  skillTypes: 'skill-types',
  skills: 'skills',
  traits: 'traits',
}

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'
