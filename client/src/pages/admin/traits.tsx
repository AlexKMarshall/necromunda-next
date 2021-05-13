import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { Column, Row } from 'react-table'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { CreateTraitDto, createTraitDtoSchema, Trait } from 'schemas'
import { useQueryTraits, useCreateTrait, useDeleteTrait } from 'hooks/traits'
import { DataTable, H1, H2, Stack } from 'components/lib'
import { Input } from 'styles/admin'
import { useModal } from 'hooks/use-modal'
import { DeletableItem } from 'types'

const traitColumns: Column<Trait>[] = [
  { Header: 'Name', accessor: 'name' as const },
]

function useWithDeleteButton<T extends DeletableItem>({
  columns,
}: {
  columns: Column<T>[]
}): Column<T>[] {
  return useMemo(
    () => [
      ...columns,
      {
        Header: 'Actions',
        accessor: 'id' as const,
        Cell: ({ row: { original } }: { row: Row<T> }) => (
          <DeleteTraitButton
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

export default function Traits() {
  const query = useQueryTraits()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()
  const columns = useWithDeleteButton({ columns: traitColumns })

  return (
    <Stack>
      <H1>Traits</H1>
      <button onClick={openModal}>Add Trait</button>
      <Dialog {...getDialogProps()}>
        <Stack>
          <H2 {...getTitleProps()}>Add New Trait</H2>
          <AddTraitForm onSubmit={closeModal} />
        </Stack>
      </Dialog>
      <DataTable columns={columns} data={query.traits} />
      {query.isLoading ? <div>Loading...</div> : null}
    </Stack>
  )
}

interface DeleteTraitButtonProps {
  id: Trait['id']
  name: Trait['name']
}

function DeleteTraitButton({ id, name }: DeleteTraitButtonProps) {
  const mutation = useDeleteTrait(id)
  return (
    <button type="button" onClick={() => mutation.mutate()}>
      Delete {name}
    </button>
  )
}

interface AddTraitFormProps {
  onSubmit?: () => void
}

function AddTraitForm({ onSubmit }: AddTraitFormProps) {
  const mutation = useCreateTrait()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTraitDto>({
    resolver: zodResolver(createTraitDtoSchema),
  })
  const nameId = useId()
  const nameErrorId = useId()

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((trait) => {
        mutation.mutate(trait)
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
      <button type="submit">Add trait</button>
    </Stack>
  )
}
