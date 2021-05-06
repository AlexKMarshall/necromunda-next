import { nanoid } from 'nanoid'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CreateFactionDto, Faction, factionSchema } from 'schemas'

const QUERY_KEY_FACTIONS = 'factions'

export function useQueryFactions() {
  const query = useQuery(QUERY_KEY_FACTIONS, async () => {
    try {
      const response = await fetch('http://localhost:3000/factions')
      const data = await response.json()
      return factionSchema.array().parse(data)
    } catch (e) {
      console.error('something went wrong', e)
      return Promise.reject(e)
    }
  })

  const factions = query.data ?? []
  return { ...query, factions }
}

export function useCreateFaction() {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (faction: CreateFactionDto) => {
      return fetch('http://localhost:3000/factions', {
        method: 'POST',
        body: JSON.stringify(faction),
        headers: {
          'content-type': 'application/json',
        },
      })
    },
    {
      onMutate: async (createFactionDto) => {
        await queryClient.cancelQueries(QUERY_KEY_FACTIONS)
        const previousFactions =
          queryClient.getQueryData<Faction[]>(QUERY_KEY_FACTIONS) ?? []

        const pendingFaction = { ...createFactionDto, id: nanoid() }

        queryClient.setQueryData<Faction[]>(QUERY_KEY_FACTIONS, [
          ...previousFactions,
          pendingFaction,
        ])

        return { previousFactions }
      },
      onSettled: () => {
        queryClient.invalidateQueries(QUERY_KEY_FACTIONS)
      },
    }
  )
  return mutation
}

export function useDeleteFaction(factionId: Faction['id']) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () => {
      return fetch(`http://localhost:3000/factions/${factionId}`, {
        method: 'DELETE',
      })
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(QUERY_KEY_FACTIONS)
        const previousFactions =
          queryClient.getQueryData<Faction[]>(QUERY_KEY_FACTIONS) ?? []

        queryClient.setQueryData(
          QUERY_KEY_FACTIONS,
          previousFactions.filter((f) => f.id !== factionId)
        )

        return { previousFactions }
      },
      onSettled: () => {
        queryClient.invalidateQueries(QUERY_KEY_FACTIONS)
      },
    }
  )
  return mutation
}
