import { nanoid } from 'nanoid'
import * as z from 'zod'

export const factionSchema = z.object({
  name: z.string().nonempty(),
  id: z.string().nonempty(),
})

export type Faction = z.infer<typeof factionSchema>

export const createFactionDtoSchema = factionSchema.omit({ id: true })

export type CreateFactionDto = z.infer<typeof createFactionDtoSchema>

export const connectFactionDtoSchema = factionSchema.pick({ id: true })

export function getPendingFaction(overrides: Partial<Faction>): Faction {
  return {
    id: nanoid(),
    name: 'Loading...',
    ...overrides,
  }
}
