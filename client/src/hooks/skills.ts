import { nanoid } from 'nanoid'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CreateSkillDto, Skill, skillSchema } from 'schemas'
import { client } from './client'
import { useQuerySkillTypes } from './skill-types'

const QUERY_KEY = 'skills'
const endpoint = 'skills'

export function useQuerySkills() {
  const query = useQuery(QUERY_KEY, async () => {
    try {
      const response = await client(endpoint)
      const data = await response.json()
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
      return client(endpoint, {
        data: skill,
      })
    },
    {
      onMutate: async (createSkillDto) => {
        await queryClient.cancelQueries(QUERY_KEY)
        const previousSkills =
          queryClient.getQueryData<Skill[]>(QUERY_KEY) ?? []

        const skillType = skillTypes.find(
          (st) => st.id === createSkillDto.type.id
        ) ?? { id: createSkillDto.type.id, name: 'Pending' }

        const pendingSkill = {
          ...createSkillDto,
          id: nanoid(),
          type: skillType,
        }

        queryClient.setQueryData<Skill[]>(QUERY_KEY, [
          ...previousSkills,
          pendingSkill,
        ])

        return { previousSkills }
      },
      onSettled: () => {
        queryClient.invalidateQueries(QUERY_KEY)
      },
    }
  )
  return mutation
}

export function useDeleteSkill(skillId: Skill['id']) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () => {
      return client(`${endpoint}/${skillId}`, {
        method: 'DELETE',
      })
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(QUERY_KEY)
        const previousSkills =
          queryClient.getQueryData<Skill[]>(QUERY_KEY) ?? []

        queryClient.setQueryData(
          QUERY_KEY,
          previousSkills.filter((f) => f.id !== skillId)
        )

        return { previousFactions: previousSkills }
      },
      onSettled: () => {
        queryClient.invalidateQueries(QUERY_KEY)
      },
    }
  )
  return mutation
}
