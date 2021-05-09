import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { Column, Row, useTable } from 'react-table'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import { CreateSkillDto, createSkillDtoSchema, Skill } from 'schemas'
import { useQuerySkills, useCreateSkill, useDeleteSkill } from 'hooks/skills'
import { H1, H2, Stack } from 'components/lib'
import { Input, Table, Td, Th, Tr } from 'styles/admin'
import { useQuerySkillTypes } from 'hooks/skill-types'

export default function Skills() {
  const query = useQuerySkills()
  const [showForm, setShowForm] = useState(false)
  const openForm = () => setShowForm(true)
  const closeForm = () => setShowForm(false)

  const columns = useMemo<Column<Skill>[]>(
    () => [
      { Header: 'Name', accessor: 'name' as const },
      { Header: 'Type', accessor: (row) => row.type.name },
      {
        Header: 'Actions',
        accessor: 'id' as const,
        Cell: ({ row: { original } }: { row: Row<Skill> }) => (
          <DeleteSkillButton
            id={original.id}
            name={original.name}
            key={original.id}
          />
        ),
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: query.skills })

  const dialogTitleId = useId()

  return (
    <Stack>
      <H1>Skills</H1>
      <button onClick={openForm}>Add Skills</button>
      <Dialog
        isOpen={showForm}
        onDismiss={closeForm}
        aria-labelledby={dialogTitleId}
      >
        <Stack>
          <H2 id={dialogTitleId}>Add New Skills</H2>
          <AddSkillForm onSubmit={closeForm} />
        </Stack>
      </Dialog>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} data-testid="table-body">
          {rows.map((row) => {
            prepareRow(row)
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                ))}
              </Tr>
            )
          })}
        </tbody>
      </Table>
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
