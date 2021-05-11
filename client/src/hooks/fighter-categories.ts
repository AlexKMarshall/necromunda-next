import { nanoid } from 'nanoid'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { client } from 'hooks/client'
import {
  CreateFighterCategoryDto,
  FighterCategory,
  fighterCategorySchema,
} from 'schemas'
import { endpoints, queryKeys } from 'config'

const fighterCategoriesQueryKey = queryKeys.fighterCategories
const fighterCategoriesEndpoint = endpoints.fighterCategories

export function useQueryFighterCategories() {
  const query = useQuery(fighterCategoriesQueryKey, async () => {
    const data = await client(fighterCategoriesEndpoint)
    return fighterCategorySchema.array().parse(data)
  })

  const fighterCategories = query.data ?? []
  return { ...query, fighterCategories }
}

export function useCreateFighterCategory() {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (fighterCategory: CreateFighterCategoryDto) => {
      return client(fighterCategoriesEndpoint, {
        data: fighterCategory,
      })
    },
    {
      onMutate: async (createFCDto) => {
        await queryClient.cancelQueries(fighterCategoriesQueryKey)
        const previousFCs =
          queryClient.getQueryData<FighterCategory[]>(
            fighterCategoriesQueryKey
          ) ?? []

        const pendingFC: FighterCategory = { ...createFCDto, id: nanoid() }

        queryClient.setQueryData<FighterCategory[]>(fighterCategoriesQueryKey, [
          ...previousFCs,
          pendingFC,
        ])

        return { previousFCs }
      },
      onSettled: () => {
        queryClient.invalidateQueries(fighterCategoriesQueryKey)
      },
    }
  )
  return mutation
}

export function useDeleteFighterCategory(
  fighterCategoryId: FighterCategory['id']
) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async () => {
      return client(`${fighterCategoriesEndpoint}/${fighterCategoryId}`, {
        method: 'DELETE',
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(fighterCategoriesQueryKey)
      },
    }
  )
  return mutation
}
