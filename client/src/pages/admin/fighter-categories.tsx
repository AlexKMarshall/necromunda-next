import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Column } from 'react-table'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import {
  CreateFighterCategoryDto,
  createFighterCategoryDtoSchema,
  FighterCategory,
} from 'schemas'
import {
  useQueryFighterCategories,
  useCreateFighterCategory,
  useDeleteFighterCategory,
} from 'hooks/fighter-categories'
import { H1, H2, Stack, TextField } from 'components/lib'
import { useModal } from 'hooks/use-modal'
import { AdminTable } from 'components/admin'

const fighterCategoryColumns: Column<FighterCategory>[] = [
  { Header: 'Name', accessor: 'name' as const },
]

export default function FighterCategories(): JSX.Element {
  const query = useQueryFighterCategories()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()

  return (
    <Stack>
      <H1>Fighter Categories</H1>
      <button onClick={openModal}>Add Fighter Category</button>
      <Dialog {...getDialogProps()}>
        <Stack>
          <H2 {...getTitleProps()}>Add New Fighter Category</H2>
          <AddFighterCategoryForm onSubmit={closeModal} />
        </Stack>
      </Dialog>
      <AdminTable
        columns={fighterCategoryColumns}
        data={query.fighterCategories}
        deleteHook={useDeleteFighterCategory}
      />
      {query.isLoading ? <div>Loading...</div> : null}
    </Stack>
  )
}

interface AddFighterCategoryFormProps {
  onSubmit?: () => void
}

function AddFighterCategoryForm({ onSubmit }: AddFighterCategoryFormProps) {
  const mutation = useCreateFighterCategory()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFighterCategoryDto>({
    resolver: zodResolver(createFighterCategoryDtoSchema),
  })

  return (
    <Stack
      as="form"
      onSubmit={handleSubmit((faction) => {
        mutation.mutate(faction)
        onSubmit?.()
      })}
    >
      <TextField
        label="Name:"
        error={errors.name}
        registration={register('name')}
      />
      <button type="submit">Add fighter category</button>
    </Stack>
  )
}
