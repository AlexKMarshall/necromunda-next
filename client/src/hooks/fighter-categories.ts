import { nanoid } from 'nanoid'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import {
  CreateFighterCategoryDto,
  FighterCategory,
  fighterCategorySchema,
} from 'schemas'

const QUERY_KEY = 'fighterCategories'

export function useQueryFighterCategories() {
  const query = useQuery(QUERY_KEY, async () => {
    const response = await fetch('http://localhost:3000/fighter-categories')
    const data = await response.json()
    return fighterCategorySchema.array().parse(data)
  })

  const fighterCategories = query.data ?? []
  return { ...query, fighterCategories }
}

export function useCreateFighterCategory() {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (fighterCategory: CreateFighterCategoryDto) => {
      return fetch('http://localhost:3000/fighter-categories', {
        method: 'POST',
        body: JSON.stringify(fighterCategory),
        headers: {
          'content-type': 'application/json',
        },
      })
    },
    {
      onMutate: async (createFCDto) => {
        await queryClient.cancelQueries(QUERY_KEY)
        const previousFCs =
          queryClient.getQueryData<FighterCategory[]>(QUERY_KEY) ?? []

        const pendingFC = { ...createFCDto, id: nanoid() }

        queryClient.setQueryData<FighterCategory[]>(QUERY_KEY, [
          ...previousFCs,
          pendingFC,
        ])

        return { previousFCs }
      },
      onSettled: () => {
        queryClient.invalidateQueries(QUERY_KEY)
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
      return fetch(
        `http://localhost:3000/fighter-categories/${fighterCategoryId}`,
        {
          method: 'DELETE',
        }
      )
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY)
      },
    }
  )
  return mutation
}
