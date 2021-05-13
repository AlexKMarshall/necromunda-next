import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { Column, Row } from 'react-table'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { CreateSkillDto, createSkillDtoSchema, Skill } from 'schemas'
import { useQuerySkills, useCreateSkill, useDeleteSkill } from 'hooks/skills'
import { DataTable, H1, H2, Stack } from 'components/lib'
import { Input } from 'styles/admin'
import { useQuerySkillTypes } from 'hooks/skill-types'
import { useModal } from 'hooks/use-modal'
import { DeletableItem } from 'types'

const skillColumns: Column<Skill>[] = [
  { Header: 'Name', accessor: 'name' as const },
  { Header: 'Type', accessor: (row) => row.type.name },
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
          <DeleteSkillButton
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

export default function Skills() {
  const query = useQuerySkills()
  const { openModal, closeModal, getDialogProps, getTitleProps } = useModal()

  const columns = useWithDeleteButton({ columns: skillColumns })

  return (
    <Stack>
      <H1>Skills</H1>
      <button onClick={openModal}>Add Skills</button>
      <Dialog {...getDialogProps()}>
        <Stack>
          <H2 {...getTitleProps()}>Add New Skills</H2>
          <AddSkillForm onSubmit={closeModal} />
        </Stack>
      </Dialog>
      <DataTable columns={columns} data={query.skills} />
      {query.isLoading ? <div>Loading...</div> : null}
    </Stack>
  )
}

interface DeleteSkillButtonProps {
  id: Skill['id']
  name: Skill['name']
}

function DeleteSkillButton({ id, name }: DeleteSkillButtonProps) {
  const mutation = useDeleteSkill(id)
  return (
    <button type="button" onClick={() => mutation.mutate()}>
      {mutation.isLoading ? 'deleting...' : `Delete ${name}`}
    </button>
  )
}

interface AddSkillFormProps {
  onSubmit?: () => void
}

function AddSkillForm({ onSubmit }: AddSkillFormProps) {
  const skillTypesQuery = useQuerySkillTypes()
  const mutation = useCreateSkill()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSkillDto>({
    resolver: zodResolver(createSkillDtoSchema),
  })
  const nameId = useId()
  const nameErrorId = useId()
  const typeId = useId()
  const typeErrorId = useId()

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
      <Stack variant="small">
        <label htmlFor={typeId}>Type:</label>
        <select
          id={typeId}
          {...register('type.id')}
          aria-invalid={!!errors.type?.id}
          aria-describedby={!!errors.type ? typeErrorId : ''}
        >
          {skillTypesQuery.isLoading ? (
            <option key="skilltypes-loading" value="">
              Loading...
            </option>
          ) : (
            <>
              <option key="skilltype-empty" value="">
                Please select
              </option>
              {skillTypesQuery.skillTypes.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </>
          )}
        </select>
        {!!errors.name && (
          <span role="alert" id={typeErrorId}>
            {errors.type?.id?.message}
          </span>
        )}
      </Stack>
      <button type="submit">Add skill type</button>
    </Stack>
  )
}
