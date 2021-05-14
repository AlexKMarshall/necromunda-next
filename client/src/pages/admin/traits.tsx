import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Column } from 'react-table'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { CreateTraitDto, createTraitDtoSchema, Trait } from 'schemas'
import { useQueryTraits, useCreateTrait, useDeleteTrait } from 'hooks/traits'
import { H1, H2, Stack, TextField } from 'components/lib'
import { useModal } from 'hooks/use-modal'
import { AdminTable } from 'components/admin'

const traitColumns: Column<Trait>[] = [
  { Header: 'Name', accessor: 'name' as const },
]

export default function Traits(): JSX.Element {
  const query = useQueryTraits()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()

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
      <AdminTable
        columns={traitColumns}
        data={query.traits}
        deleteHook={useDeleteTrait}
      />
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

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((trait) => {
        mutation.mutate(trait)
        onSubmit?.()
      })}
    >
      <TextField
        label="Name:"
        error={errors.name}
        registration={register('name')}
      />
      <button type="submit">Add trait</button>
    </Stack>
  )
}
