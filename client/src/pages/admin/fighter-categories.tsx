import { useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { Row, useTable } from 'react-table'
import styled from 'styled-components'
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
import { Input, Table, Td, Th, Tr } from 'styles/admin'
import { nanoid } from 'nanoid'

export default function FighterCategories() {
  const query = useQueryFighterCategories()
  const [showForm, setShowForm] = useState(false)
  const openForm = () => setShowForm(true)
  const closeForm = () => setShowForm(false)

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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: query.fighterCategories })

  const dialogTitleId = useId()

  return (
    <Stack>
      <H1>Fighter Categories</H1>
      <button onClick={openForm}>Add Fighter Category</button>
      <Dialog
        isOpen={showForm}
        onDismiss={closeForm}
        aria-labelledby={dialogTitleId}
      >
        <Stack>
          <H2 id={dialogTitleId}>Add New Fighter Category</H2>
          <AddFighterCategoryForm onSubmit={closeForm} />
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
