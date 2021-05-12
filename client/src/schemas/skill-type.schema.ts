import { nanoid } from 'nanoid'
import * as z from 'zod'
import { Skill } from './skill.schema'

export const skillTypeSchema = z.object({
  name: z.string().nonempty(),
  id: z.string().nonempty(),
})

export type SkillType = z.infer<typeof skillTypeSchema>

export const createSkillTypeDtoSchema = skillTypeSchema.omit({ id: true })

export type CreateSkillTypeDto = z.infer<typeof createSkillTypeDtoSchema>

export const connectSkillTypeDtoSchema = skillTypeSchema.pick({ id: true })

export function getPendingSkillType(overrides: Partial<Skill> = {}): SkillType {
  return {
    id: nanoid(),
    name: 'Loading...',
    ...overrides,
  }
}
