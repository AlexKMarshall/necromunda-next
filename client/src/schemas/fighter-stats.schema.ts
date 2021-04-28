import * as z from 'zod'

export const fighterStatsSchema = z.object({
  id: z.string().nonempty(),
  movement: z.number(),
  weaponSkill: z.number(),
  ballisticSkill: z.number(),
  strength: z.number(),
  toughness: z.number(),
  wounds: z.number(),
  initiative: z.number(),
  attacks: z.number(),
  leadership: z.number(),
  cool: z.number(),
  will: z.number(),
  intelligence: z.number(),
})

export type FighterStats = z.infer<typeof fighterStatsSchema>

export const createFighterStatsDtoSchema = fighterStatsSchema.omit({
  id: true,
})

export type CreateFighterStatsDto = z.infer<typeof createFighterStatsDtoSchema>
