import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { Row } from 'react-table'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { CreateTraitDto, createTraitDtoSchema, Trait } from 'schemas'
import { useQueryTraits, useCreateTrait, useDeleteTrait } from 'hooks/traits'
import { DataTable, H1, H2, Stack } from 'components/lib'
import { Input } from 'styles/admin'
import { useModal } from 'hooks/use-modal'

export default function Traits() {
  const query = useQueryTraits()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' as const },
      {
        Header: 'Actions',
        accessor: 'id' as const,
        Cell: ({ row: { original } }: { row: Row<Trait> }) => (
          <DeleteTraitButton
            traitId={original.id}
            traitName={original.name}
            key={original.id}
          />
        ),
      },
    ],
    []
  )

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
  traitId: Trait['id']
  traitName: Trait['name']
}

function DeleteTraitButton({ traitId, traitName }: DeleteTraitButtonProps) {
  const mutation = useDeleteTrait(traitId)
  return (
    <button type="button" onClick={() => mutation.mutate()}>
      Delete {traitName}
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
