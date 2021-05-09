import * as z from 'zod'
import { connectSkillTypeDtoSchema, skillTypeSchema } from './skill-type.schema'

export const skillSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  type: skillTypeSchema,
})

export type Skill = z.infer<typeof skillSchema>

export const createSkillDtoSchema = skillSchema
  .omit({
    id: true,
  })
  .extend({
    type: connectSkillTypeDtoSchema,
  })

export type CreateSkillDto = z.infer<typeof createSkillDtoSchema>
