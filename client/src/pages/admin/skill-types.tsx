import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { Column, Row } from 'react-table'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import {
  CreateSkillTypeDto,
  createSkillTypeDtoSchema,
  SkillType,
} from 'schemas'
import {
  useQuerySkillTypes,
  useCreateSkillType,
  useDeleteSkillType,
} from 'hooks/skill-types'
import { DataTable, H1, H2, Stack } from 'components/lib'
import { Input } from 'styles/admin'
import { useModal } from 'hooks/use-modal'
import { DeletableItem } from 'types'

const skillTypeColumns: Column<SkillType>[] = [
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
          <DeleteSkillTypeButton
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

export default function SkillTypes() {
  const query = useQuerySkillTypes()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()

  const columns = useWithDeleteButton({ columns: skillTypeColumns })

  return (
    <Stack>
      <H1>Skill Types</H1>
      <button onClick={openModal}>Add Skill Type</button>
      <Dialog {...getDialogProps()}>
        <Stack>
          <H2 {...getTitleProps()}>Add New Skill Type</H2>
          <AddSkillTypeForm onSubmit={closeModal} />
        </Stack>
      </Dialog>
      <DataTable columns={columns} data={query.skillTypes} />
      {query.isLoading ? <div>Loading...</div> : null}
    </Stack>
  )
}

interface DeleteSkillTypeButtonProps {
  id: SkillType['id']
  name: SkillType['name']
}

function DeleteSkillTypeButton({ id, name }: DeleteSkillTypeButtonProps) {
  const mutation = useDeleteSkillType(id)
  return (
    <button type="button" onClick={() => mutation.mutate()}>
      {mutation.isLoading ? 'deleting...' : `Delete ${name}`}
    </button>
  )
}

interface AddSkillTypeFormProps {
  onSubmit?: () => void
}

function AddSkillTypeForm({ onSubmit }: AddSkillTypeFormProps) {
  const mutation = useCreateSkillType()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSkillTypeDto>({
    resolver: zodResolver(createSkillTypeDtoSchema),
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
      <button type="submit">Add skill type</button>
    </Stack>
  )
}
