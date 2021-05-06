import { useQuery } from 'react-query'
import { factionSchema } from 'schemas'

const QUERY_KEY = 'factions'

export function useQueryFactions() {
  const query = useQuery(QUERY_KEY, async () => {
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
