import * as z from 'zod'
import { connectFactionDtoSchema, factionSchema } from './faction.schema'
import {
  connectFighterCategoryDtoSchema,
  fighterCategorySchema,
} from './fighter-category.schema'
import {
  createFighterStatsDtoSchema,
  fighterStatsSchema,
} from './fighter-stats.schema'

export const fighterTypeSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  faction: factionSchema,
  fighterCategory: fighterCategorySchema,
  cost: z.number().positive(),
  fighterStats: fighterStatsSchema,
})

export type FighterType = z.infer<typeof fighterTypeSchema>

export const createFighterTypeDtoSchema = fighterTypeSchema
  .omit({
    id: true,
  })
  .extend({
    faction: connectFactionDtoSchema,
    fighterCategory: connectFighterCategoryDtoSchema,
    fighterStats: createFighterStatsDtoSchema,
  })

export type CreateFighterTypeDto = z.infer<typeof createFighterTypeDtoSchema>
