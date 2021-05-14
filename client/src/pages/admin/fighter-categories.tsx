import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Column } from 'react-table'
import { useId } from 'react-aria'
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
import { H1, H2, Stack } from 'components/lib'
import { Input } from 'styles/admin'
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
      <button type="submit">Add fighter category</button>
    </Stack>
  )
}
