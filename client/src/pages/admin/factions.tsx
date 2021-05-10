import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { Row } from 'react-table'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { CreateFactionDto, createFactionDtoSchema, Faction } from 'schemas'
import {
  useQueryFactions,
  useCreateFaction,
  useDeleteFaction,
} from 'hooks/factions'
import { H1, H2, Stack } from 'components/lib'
import { Input } from 'styles/admin'
import { DataTable } from 'components/lib'

export default function Factions() {
  const query = useQueryFactions()
  const [showForm, setShowForm] = useState(false)
  const openForm = () => setShowForm(true)
  const closeForm = () => setShowForm(false)

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' as const },
      {
        Header: 'Actions',
        accessor: 'id' as const,
        Cell: ({ row: { original } }: { row: Row<Faction> }) => (
          <DeleteFactionButton
            factionId={original.id}
            factionName={original.name}
            key={original.id}
          />
        ),
      },
    ],
    []
  )

  const dialogTitleId = useId()

  return (
    <Stack>
      <H1>Factions</H1>
      <button onClick={openForm}>Add Faction</button>
      <Dialog
        isOpen={showForm}
        onDismiss={closeForm}
        aria-labelledby={dialogTitleId}
      >
        <Stack>
          <H2 id={dialogTitleId}>Add New Faction</H2>
          <AddFactionForm onSubmit={closeForm} />
        </Stack>
      </Dialog>
      <DataTable columns={columns} data={query.factions} />
      {query.isLoading ? <div>Loading...</div> : null}
    </Stack>
  )
}

interface DeleteFactionButtonProps {
  factionId: Faction['id']
  factionName: Faction['name']
}

function DeleteFactionButton({
  factionId,
  factionName,
}: DeleteFactionButtonProps) {
  const mutation = useDeleteFaction(factionId)
  return (
    <button type="button" onClick={() => mutation.mutate()}>
      {mutation.isLoading ? 'deleting...' : `Delete ${factionName}`}
    </button>
  )
}

interface AddFactionFormProps {
  onSubmit?: () => void
}

function AddFactionForm({ onSubmit }: AddFactionFormProps) {
  const mutation = useCreateFaction()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFactionDto>({
    resolver: zodResolver(createFactionDtoSchema),
  })
  const nameId = useId()
  const nameErrorId = useId()

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((faction) => {
        mutation.mutate(faction)
        onSubmit?.()
      })}
    >
      <Stack variant="small">
        <label htmlFor={nameId}>Name:</label>
        <Input
          id={nameId}
          {...register('name')}
          aria-invalid={!!errors.name}
          aria-describedby={!!errors.name ? nameErrorId : ''}
        />
        {!!errors.name && (
          <span role="alert" id={nameErrorId}>
            {errors.name.message}
          </span>
        )}
      </Stack>
      <button type="submit">Add faction</button>
    </Stack>
  )
}
