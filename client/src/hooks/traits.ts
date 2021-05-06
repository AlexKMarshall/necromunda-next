import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CreateTraitDto, Trait, traitSchema } from 'schemas'
import { client } from './client'

const QUERY_KEY = 'traits'
const ENDPOINT = 'traits'

export function useQueryTraits() {
  const query = useQuery(QUERY_KEY, async () => {
    const response = await client(ENDPOINT)
    const data = await response.json()
    return traitSchema.array().parse(data)
  })

  const traits = query.data ?? []
  return { ...query, traits }
}

export function useCreateTrait() {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (trait: CreateTraitDto) => {
      return client(ENDPOINT, {
        data: trait,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY)
      },
    }
  )
  return mutation
}

export function useDeleteTrait(traitId: Trait['id']) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async () => {
      return client(`${ENDPOINT}/${traitId}`, {
        method: 'DELETE',
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY)
      },
    }
  )
  return mutation
}
