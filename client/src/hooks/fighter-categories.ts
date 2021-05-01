import { useQuery } from 'react-query'
import { fighterCategorySchema } from 'schemas'

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
