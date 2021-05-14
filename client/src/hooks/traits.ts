import { endpoints, queryKeys } from 'config'
import { nanoid } from 'nanoid'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CreateTraitDto, Trait, traitSchema } from 'schemas'
import { client } from './client'

const traitsQueryKey = queryKeys.traits
const traitsEndpoint = endpoints.traits

export function useQueryTraits() {
  const query = useQuery(traitsQueryKey, async () => {
    const data = await client(traitsEndpoint)
    return traitSchema.array().parse(data)
  })

  const traits = query.data ?? []
  return { ...query, traits }
}

export function useCreateTrait() {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (trait: CreateTraitDto) => {
      return client(traitsEndpoint, {
        data: trait,
      })
    },
    {
      onMutate: async (createTraitDto) => {
        await queryClient.cancelQueries(traitsQueryKey)
        const previousTraits =
          queryClient.getQueryData<Trait[]>(traitsQueryKey) ?? []

        const pendingTrait = { ...createTraitDto, id: nanoid() }

        queryClient.setQueryData<Trait[]>(traitsQueryKey, [
          ...previousTraits,
          pendingTrait,
        ])

        return { previousTraits }
      },
      onSettled: () => {
        queryClient.invalidateQueries(traitsQueryKey)
      },
    }
  )
  return mutation
}

export function useDeleteTrait(traitId: Trait['id']) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async () => {
      return client(`${traitsEndpoint}/${traitId}`, {
        method: 'DELETE',
      })
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(traitsQueryKey)
        const previousTraits =
          queryClient.getQueryData<Trait[]>(traitsQueryKey) ?? []

        queryClient.setQueryData<Trait[]>(
          traitsQueryKey,
          previousTraits.filter((t) => t.id !== traitId)
        )

        return { previousTraits }
      },
      onSettled: () => {
        queryClient.invalidateQueries(traitsQueryKey)
      },
    }
  )
  return mutation
}
