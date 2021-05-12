import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { Row } from 'react-table'
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
import { DataTable, H1, H2, Stack } from 'components/lib'
import { Input } from 'styles/admin'
import { useModal } from 'hooks/use-modal'

export default function FighterCategories() {
  const query = useQueryFighterCategories()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' as const },
      {
        Header: 'Actions',
        accessor: 'id' as const,
        Cell: ({ row: { original } }: { row: Row<FighterCategory> }) => (
          <DeleteFighterCategoryButton
            fighterCategoryId={original.id}
            fighterCategoryName={original.name}
            key={original.id}
          />
        ),
      },
    ],
    []
  )

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
      <DataTable columns={columns} data={query.fighterCategories} />
      {query.isLoading ? <div>Loading...</div> : null}
    </Stack>
  )
}

interface DeleteFighterCategoryButtonProps {
  fighterCategoryId: FighterCategory['id']
  fighterCategoryName: FighterCategory['name']
}

function DeleteFighterCategoryButton({
  fighterCategoryId,
  fighterCategoryName,
}: DeleteFighterCategoryButtonProps) {
  const mutation = useDeleteFighterCategory(fighterCategoryId)
  return (
    <button type="button" onClick={() => mutation.mutate()}>
      Delete {fighterCategoryName}
    </button>
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
          aria-describedby={!!errors.name ? nameErrorId : ''}
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
