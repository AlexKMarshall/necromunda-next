import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Column } from 'react-table'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { CreateFactionDto, createFactionDtoSchema, Faction } from 'schemas'
import {
  useQueryFactions,
  useCreateFaction,
  useDeleteFaction,
} from 'hooks/factions'
import { DeleteButton, H1, H2, Stack } from 'components/lib'
import { Input } from 'styles/admin'
import { DataTable } from 'components/lib'
import { useModal } from 'hooks/use-modal'
import { useWithDeleteColumn } from 'hooks/use-with-delete-column'

const factionColumns: Column<Faction>[] = [
  { Header: 'Name', accessor: 'name' as const },
]

export default function Factions(): JSX.Element {
  const query = useQueryFactions()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()
  const columns = useWithDeleteColumn({
    columns: factionColumns,
    deleteHook: useDeleteFaction,
    DeleteButtonComponent: DeleteButton,
  })

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

interface AddFactionFormProps {
  onSubmit?: () => void
}

function AddFactionForm({ onSubmit }: AddFactionFormProps): JSX.Element {
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
          aria-describedby={errors.name ? nameErrorId : ''}
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
