import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { CreateFactionDto, factionSchema } from '../../schemas'

export default function Factions() {
  const queryClient = useQueryClient()
  const query = useQuery('factions', async () => {
    const response = await fetch('/factions')
    const data = await response.json()
    console.log(data)
    return factionSchema.array().parse(data)
  })
  const [name, setName] = useState('')

  const mutation = useMutation(
    async (faction: CreateFactionDto) => {
      const response = await fetch('/factions', {
        method: 'POST',
        body: JSON.stringify(faction),
        headers: {
          'content-type': 'application/json',
        },
      })
      const data = await response.json()
      // return factionSchema.parse(data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('factions')
      },
    }
  )

  return (
    <>
      <h1>Factions</h1>
      <ul>
        {(query.data ?? []).map((f) => (
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
