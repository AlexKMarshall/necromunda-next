import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { CreateFactionDto, factionSchema } from '../../schemas'

function useQueryFactions() {
  const query = useQuery('factions', async () => {
    const response = await fetch('/factions')
    const data = await response.json()
    return factionSchema.array().parse(data)
  })

  const factions = query.data ?? []
  return { ...query, factions }
}

function useCreateFaction() {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (faction: CreateFactionDto) => {
      return fetch('/factions', {
        method: 'POST',
        body: JSON.stringify(faction),
        headers: {
          'content-type': 'application/json',
        },
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('factions')
      },
    }
  )
  return mutation
}

export default function Factions() {
  const query = useQueryFactions()
  const mutation = useCreateFaction()
  const [name, setName] = useState('')

  return (
    <>
      <h1>Factions</h1>
      <ul>
        {query.factions.map((f) => (
          <li key={f.id}>
            {f.name} - {f.id}
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          mutation.mutate({ name })
        }}
      >
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add faction</button>
      </form>
    </>
  )
}
