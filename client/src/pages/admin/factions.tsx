import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateFactionDto,
  createFactionDtoSchema,
  factionSchema,
} from '../../schemas'

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFactionDto>({
    resolver: zodResolver(createFactionDtoSchema),
  })

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
      <form onSubmit={handleSubmit((faction) => mutation.mutate(faction))}>
        <label htmlFor="name">Name</label>
        <input id="name" {...register('name')} />
        {!!errors.name && <span role="alert">{errors.name.message}</span>}
        <button type="submit">Add faction</button>
      </form>
    </>
  )
}
