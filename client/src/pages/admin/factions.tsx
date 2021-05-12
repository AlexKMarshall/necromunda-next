import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
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

function useModal(initialIsOpen = false) {
  const [showModal, setShowModal] = useState(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  const titleId = useId()
  const getTitleProps = () => ({ id: titleId })

  const getDialogProps = () => ({
    isOpen: showModal,
    onDismiss: closeModal,
    'aria-labelledby': titleId,
  })

  return { showModal, openModal, closeModal, getTitleProps, getDialogProps }
}

function useDataColumns() {
  return useMemo(() => [{ Header: 'Name', accessor: 'name' as const }], [])
}

function useWithDeleteColumn<T extends {}>(columns: Column<T>[]) {
  return useMemo(
    () => [
      ...columns,
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
    [columns]
  )
}

export default function Factions() {
  const query = useQueryFactions()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()

  const dataCols = useDataColumns()
  const columns = useWithDeleteColumn(dataCols)

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
