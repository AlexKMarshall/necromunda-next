import { nanoid } from 'nanoid'
import * as z from 'zod'

export const fighterCategorySchema = z.object({
  name: z.string().nonempty(),
  id: z.string().nonempty(),
})

export type FighterCategory = z.infer<typeof fighterCategorySchema>

export const createFighterCategoryDtoSchema = fighterCategorySchema.omit({
  id: true,
})

export type CreateFighterCategoryDto = z.infer<
  typeof createFighterCategoryDtoSchema
>

export const connectFighterCategoryDtoSchema = fighterCategorySchema.pick({
  id: true,
})

export function getPendingFighterCategory(
  overrides: Partial<FighterCategory> = {}
): FighterCategory {
  return {
    id: nanoid(),
    name: 'Loading...',
    ...overrides,
  }
}
