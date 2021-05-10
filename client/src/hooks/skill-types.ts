import { endpoints, queryKeys } from 'config'
import { nanoid } from 'nanoid'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CreateSkillTypeDto, SkillType, skillTypeSchema } from 'schemas'
import { client } from './client'

const skillTypesQueryKey = queryKeys.skillTypes
const skillTypesEndpoint = endpoints.skillTypes

export function useQuerySkillTypes() {
  const query = useQuery(skillTypesQueryKey, async () => {
    try {
      const response = await client(skillTypesEndpoint)
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
      return client(skillTypesEndpoint, {
        data: skillType,
      })
    },
    {
      onMutate: async (createSkillTypeDto) => {
        await queryClient.cancelQueries(skillTypesQueryKey)
        const previousSkillTypes =
          queryClient.getQueryData<SkillType[]>(skillTypesQueryKey) ?? []

        const pendingSkillType = { ...createSkillTypeDto, id: nanoid() }

        queryClient.setQueryData<SkillType[]>(skillTypesQueryKey, [
          ...previousSkillTypes,
          pendingSkillType,
        ])

        return { previousSkillTypes }
      },
      onSettled: () => {
        queryClient.invalidateQueries(skillTypesQueryKey)
      },
    }
  )
  return mutation
}

export function useDeleteSkillType(skillTypeId: SkillType['id']) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () => {
      return client(`${skillTypesEndpoint}/${skillTypeId}`, {
        method: 'DELETE',
      })
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(skillTypesQueryKey)
        const previousSkillTypes =
          queryClient.getQueryData<SkillType[]>(skillTypesQueryKey) ?? []

        queryClient.setQueryData(
          skillTypesQueryKey,
          previousSkillTypes.filter((f) => f.id !== skillTypeId)
        )

        return { previousSkillTypes }
      },
      onSettled: () => {
        queryClient.invalidateQueries(skillTypesQueryKey)
      },
    }
  )
  return mutation
}
