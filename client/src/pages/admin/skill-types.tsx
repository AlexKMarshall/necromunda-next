import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { Row, useTable } from 'react-table'
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
import { H1, H2, Stack } from 'components/lib'
import { Input, Table, Td, Th, Tr } from 'styles/admin'

export default function SkillTypes() {
  const query = useQuerySkillTypes()
  const [showForm, setShowForm] = useState(false)
  const openForm = () => setShowForm(true)
  const closeForm = () => setShowForm(false)

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' as const },
      {
        Header: 'Actions',
        accessor: 'id' as const,
        Cell: ({ row: { original } }: { row: Row<SkillType> }) => (
          <DeleteSkillTypeButton
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
  } = useTable({ columns, data: query.skillTypes })

  const dialogTitleId = useId()

  return (
    <Stack>
      <H1>Skill Types</H1>
      <button onClick={openForm}>Add Skill Type</button>
      <Dialog
        isOpen={showForm}
        onDismiss={closeForm}
        aria-labelledby={dialogTitleId}
      >
        <Stack>
          <H2 id={dialogTitleId}>Add New Skill Type</H2>
          <AddSkillTypeForm onSubmit={closeForm} />
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