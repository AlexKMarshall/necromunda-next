import { nanoid } from 'nanoid'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CreateSkillTypeDto, SkillType, skillTypeSchema } from 'schemas'
import { client } from './client'

const QUERY_KEY = 'skill-types'
const endpoint = 'skill-types'

export function useQuerySkillTypes() {
  const query = useQuery(QUERY_KEY, async () => {
    try {
      const response = await client(endpoint)
      const data = await response.json()
      return skillTypeSchema.array().parse(data)
    } catch (e) {
      console.error('something went wrong', e)
      return Promise.reject(e)
    }
  })

  const skillTypes = query.data ?? []
  return { ...query, skillTypes }
}

export function useCreateSkillType() {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (skillType: CreateSkillTypeDto) => {
      return client(endpoint, {
        data: skillType,
      })
    },
    {
      onMutate: async (createSkillTypeDto) => {
        await queryClient.cancelQueries(QUERY_KEY)
        const previousSkillTypes =
          queryClient.getQueryData<SkillType[]>(QUERY_KEY) ?? []

        const pendingSkillType = { ...createSkillTypeDto, id: nanoid() }

        queryClient.setQueryData<SkillType[]>(QUERY_KEY, [
          ...previousSkillTypes,
          pendingSkillType,
        ])

        return { previousSkillTypes }
      },
      onSettled: () => {
        queryClient.invalidateQueries(QUERY_KEY)
      },
    }
  )
  return mutation
}

export function useDeleteSkillType(skillTypeId: SkillType['id']) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () => {
      return client(`${endpoint}/${skillTypeId}`, {
        method: 'DELETE',
      })
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(QUERY_KEY)
        const previousSkillTypes =
          queryClient.getQueryData<SkillType[]>(QUERY_KEY) ?? []

        queryClient.setQueryData(
          QUERY_KEY,
          previousSkillTypes.filter((f) => f.id !== skillTypeId)
        )

        return { previousSkillTypes }
      },
      onSettled: () => {
        queryClient.invalidateQueries(QUERY_KEY)
      },
    }
  )
  return mutation
}
