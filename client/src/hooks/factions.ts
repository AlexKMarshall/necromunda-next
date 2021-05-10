import { nanoid } from 'nanoid'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CreateFactionDto, Faction, factionSchema } from 'schemas'
import { client } from './client'
import { queryKeys, endpoints } from 'config'

const factionsQueryKey = queryKeys.factions
const factionsEndpoint = endpoints.factions

export function useQueryFactions() {
  const query = useQuery(factionsQueryKey, async () => {
    try {
      const response = await client(factionsEndpoint)
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
      return client(factionsEndpoint, {
        data: faction,
      })
    },
    {
      onMutate: async (createFactionDto) => {
        await queryClient.cancelQueries(factionsQueryKey)
        const previousFactions =
          queryClient.getQueryData<Faction[]>(factionsQueryKey) ?? []

        const pendingFaction: Faction = { ...createFactionDto, id: nanoid() }

        queryClient.setQueryData<Faction[]>(factionsQueryKey, [
          ...previousFactions,
          pendingFaction,
        ])

        return { previousFactions }
      },
      onSettled: () => {
        queryClient.invalidateQueries(factionsQueryKey)
      },
    }
  )
  return mutation
}

export function useDeleteFaction(factionId: Faction['id']) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () => {
      return client(`${factionsEndpoint}/${factionId}`, {
        method: 'DELETE',
      })
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(factionsQueryKey)
        const previousFactions =
          queryClient.getQueryData<Faction[]>(factionsQueryKey) ?? []

        queryClient.setQueryData(
          factionsQueryKey,
          previousFactions.filter((f) => f.id !== factionId)
        )

        return { previousFactions }
      },
      onSettled: () => {
        queryClient.invalidateQueries(factionsQueryKey)
      },
    }
  )
  return mutation
}
