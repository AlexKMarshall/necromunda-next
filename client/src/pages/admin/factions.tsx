import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { Column, Row } from 'react-table'
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
import { useModal } from 'hooks/use-modal'
import { DeletableItem } from 'types'

const factionColumns: Column<Faction>[] = [
  { Header: 'Name', accessor: 'name' as const },
]

function useWithDeleteColumn<T extends DeletableItem>({
  columns,
}: {
  columns: Column<T>[]
}) {
  return useMemo(
    () => [
      ...columns,
      {
        Header: 'Actions',
        accessor: 'id' as const,
        Cell: ({ row: { original } }: { row: Row<T> }) => (
          <DeleteFactionButton
            id={original.id}
            name={original.name}
            key={original.id}
          />
        ),
      },
    ],
    [columns]
  )
}

export default function Factions() {
  const query = useQueryFactions()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()

  const columns = useWithDeleteColumn({ columns: factionColumns })

  return (
    <Stack>
      <H1>Factions</H1>
      <button onClick={openModal}>Add Faction</button>
      <Dialog {...getDialogProps()}>
        <Stack>
          <H2 {...getTitleProps()}>Add New Faction</H2>
          <AddFactionForm onSubmit={closeModal} />
        </Stack>
      </Dialog>
      <DataTable columns={columns} data={query.factions} />
      {query.isLoading ? <div>Loading...</div> : null}
    </Stack>
  )
}

interface DeleteFactionButtonProps {
  id: Faction['id']
  name: Faction['name']
}

function DeleteFactionButton({ id, name }: DeleteFactionButtonProps) {
  const mutation = useDeleteFaction(id)
  return (
    <button type="button" onClick={() => mutation.mutate()}>
      {mutation.isLoading ? 'deleting...' : `Delete ${name}`}
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
