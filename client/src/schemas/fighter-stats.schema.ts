import * as z from 'zod'

export const fighterStatsSchema = z.object({
  id: z.string().nonempty(),
  movement: z.number().positive(),
  weaponSkill: z.number().positive(),
  ballisticSkill: z.number().positive(),
  strength: z.number().positive(),
  toughness: z.number().positive(),
  wounds: z.number().positive(),
  initiative: z.number().positive(),
  attacks: z.number().positive(),
  leadership: z.number().positive(),
  cool: z.number().positive(),
  will: z.number().positive(),
  intelligence: z.number().positive(),
})

export type FighterStats = z.infer<typeof fighterStatsSchema>

export const createFighterStatsDtoSchema = fighterStatsSchema.omit({
  id: true,
})

export type CreateFighterStatsDto = z.infer<typeof createFighterStatsDtoSchema>
