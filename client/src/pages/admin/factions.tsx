import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Column } from 'react-table'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { CreateFactionDto, createFactionDtoSchema, Faction } from 'schemas'
import {
  useQueryFactions,
  useCreateFaction,
  useDeleteFaction,
} from 'hooks/factions'
import { H1, H2, Stack, TextInput } from 'components/lib'
import { AdminTable } from 'components/admin'
import { useModal } from 'hooks/use-modal'

const factionColumns: Column<Faction>[] = [
  { Header: 'Name', accessor: 'name' as const },
]

export default function Factions(): JSX.Element {
  const query = useQueryFactions()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()

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

      <AdminTable
        columns={factionColumns}
        data={query.factions}
        deleteHook={useDeleteFaction}
      />
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

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((faction) => {
        mutation.mutate(faction)
        onSubmit?.()
      })}
    >
      <TextInput
        label="Name:"
        error={errors.name}
        registration={register('name')}
      />
      <button type="submit">Add faction</button>
    </Stack>
  )
}
