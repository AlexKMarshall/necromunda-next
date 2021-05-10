import { endpoints, queryKeys } from 'config'
import { nanoid } from 'nanoid'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { fighterTypeSchema, CreateFighterTypeDto, FighterType } from 'schemas'
import { client } from './client'
import { useQueryFactions } from './factions'
import { useQueryFighterCategories } from './fighter-categories'

const fighterTypesQueryKey = queryKeys.fighterTypes
const fighterTypesEndpoint = endpoints.fighterTypes

export function useQueryFighterTypes() {
  const query = useQuery(fighterTypesQueryKey, async () => {
    try {
      const response = await client(fighterTypesEndpoint)
      const data = await response.json()
      return fighterTypeSchema.array().parse(data)
    } catch (e) {
      console.error(e)
      return Promise.reject(e)
    }
  })

  const fighterTypes = query.data ?? []
  return { ...query, fighterTypes }
}

export function useCreateFighterType() {
  const queryClient = useQueryClient()
  const { factions } = useQueryFactions()
  const { fighterCategories } = useQueryFighterCategories()

  const mutation = useMutation(
    async (fighterType: CreateFighterTypeDto) => {
      return client(fighterTypesEndpoint, {
        data: fighterType,
      })
    },
    {
      onMutate: async (createFtDto) => {
        await queryClient.cancelQueries(fighterTypesQueryKey)
        const previousFTs =
          queryClient.getQueryData<FighterType[]>(fighterTypesQueryKey) ?? []

        const faction = factions.find(
          (f) => f.id === createFtDto.faction.id
        ) ?? { id: createFtDto.faction.id, name: 'Pending' }
        const category = fighterCategories.find(
          (fc) => fc.id === createFtDto.fighterCategory.id
        ) ?? { id: createFtDto.fighterCategory.id, name: 'Pending' }

        const pendingFT: FighterType = {
          ...createFtDto,
          id: nanoid(),
          faction,
          fighterCategory: category,
          fighterStats: { ...createFtDto.fighterStats, id: nanoid() },
        }

        queryClient.setQueryData<FighterType[]>(fighterTypesQueryKey, [
          ...previousFTs,
          pendingFT,
        ])

        return { previousFTs }
      },
      onSettled: () => {
        queryClient.invalidateQueries(fighterTypesQueryKey)
      },
    }
  )
  return mutation
}

export function useDeleteFighterType(fighterTypeId: FighterType['id']) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async () => {
      return client(`${fighterTypesEndpoint}/${fighterTypeId}`, {
        method: 'DELETE',
      })
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(fighterTypesQueryKey)

        const previousFighterTypes =
          queryClient.getQueryData<FighterType[]>(fighterTypesQueryKey) ?? []

        queryClient.setQueryData<FighterType[]>(
          fighterTypesQueryKey,
          previousFighterTypes.filter((ft) => ft.id !== fighterTypeId)
        )

        return { previousFighterTypes }
      },
      onSettled: () => {
        queryClient.invalidateQueries(fighterTypesQueryKey)
      },
    }
  )
  return mutation
}
