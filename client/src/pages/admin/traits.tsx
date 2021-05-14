import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Column } from 'react-table'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { CreateTraitDto, createTraitDtoSchema, Trait } from 'schemas'
import { useQueryTraits, useCreateTrait, useDeleteTrait } from 'hooks/traits'
import { DataTable, DeleteButton, H1, H2, Stack } from 'components/lib'
import { Input } from 'styles/admin'
import { useModal } from 'hooks/use-modal'
import { useWithDeleteColumn } from 'hooks/use-with-delete-column'

const traitColumns: Column<Trait>[] = [
  { Header: 'Name', accessor: 'name' as const },
]

export default function Traits(): JSX.Element {
  const query = useQueryTraits()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()
  const columns = useWithDeleteColumn({
    columns: traitColumns,
    deleteHook: useDeleteTrait,
    DeleteButtonComponent: DeleteButton,
  })

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
          aria-describedby={errors.name ? nameErrorId : ''}
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
