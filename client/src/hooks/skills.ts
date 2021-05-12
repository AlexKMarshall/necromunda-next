import { endpoints, queryKeys } from 'config'
import { nanoid } from 'nanoid'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  CreateSkillDto,
  getPendingSkillType,
  Skill,
  skillSchema,
} from 'schemas'
import { client } from './client'
import { useQuerySkillTypes } from './skill-types'

const skillsQueryKey = queryKeys.skills
const skillsEndpoint = endpoints.skills

export function useQuerySkills() {
  const query = useQuery(skillsQueryKey, async () => {
    try {
      const data = await client(skillsEndpoint)
      return skillSchema.array().parse(data)
    } catch (e) {
      console.error('something went wrong', e)
      return Promise.reject(e)
    }
  })

  const skills = query.data ?? []
  return { ...query, skills }
}

export function useCreateSkill() {
  const queryClient = useQueryClient()
  const { skillTypes } = useQuerySkillTypes()

  const mutation = useMutation(
    async (skill: CreateSkillDto) => {
      return client(skillsEndpoint, {
        data: skill,
      })
    },
    {
      onMutate: async (createSkillDto) => {
        await queryClient.cancelQueries(skillsQueryKey)
        const previousSkills =
          queryClient.getQueryData<Skill[]>(skillsQueryKey) ?? []

        const skillType =
          skillTypes.find((st) => st.id === createSkillDto.type.id) ??
          getPendingSkillType()

        const pendingSkill = {
          ...createSkillDto,
          id: nanoid(),
          type: skillType,
        }

        queryClient.setQueryData<Skill[]>(skillsQueryKey, [
          ...previousSkills,
          pendingSkill,
        ])

        return { previousSkills }
      },
      onSettled: () => {
        queryClient.invalidateQueries(skillsQueryKey)
      },
    }
  )
  return mutation
}

export function useDeleteSkill(skillId: Skill['id']) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () => {
      return client(`${skillsEndpoint}/${skillId}`, {
        method: 'DELETE',
      })
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(skillsQueryKey)
        const previousSkills =
          queryClient.getQueryData<Skill[]>(skillsQueryKey) ?? []

        queryClient.setQueryData(
          skillsQueryKey,
          previousSkills.filter((f) => f.id !== skillId)
        )

        return { previousFactions: previousSkills }
      },
      onSettled: () => {
        queryClient.invalidateQueries(skillsQueryKey)
      },
    }
  )
  return mutation
}
