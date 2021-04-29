import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CreateTraitDto, Trait, traitSchema } from 'schemas'

const QUERY_KEY = 'traits'
const ENDPOINT = 'http://localhost:3000/traits'

export function useQueryTraits() {
  const query = useQuery(QUERY_KEY, async () => {
    const response = await fetch(ENDPOINT)
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
      return fetch(ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(trait),
        headers: {
          'content-type': 'application/json',
        },
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
      return fetch(`${ENDPOINT}/${traitId}`, {
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
