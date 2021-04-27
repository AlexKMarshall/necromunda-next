import { useQuery, useMutation, useQueryClient } from 'react-query'
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
  fighterCategorySchema,
} from 'schemas'
import { H1, H2, Stack } from 'components/lib'

function useQueryFighterCategories() {
  const query = useQuery('fighter-categories', async () => {
    const response = await fetch('http://localhost:3000/fighter-categories')
    const data = await response.json()
    return fighterCategorySchema.array().parse(data)
  })

  const fighterCategories = query.data ?? []
  return { ...query, fighterCategories }
}

function useCreateFighterCategory() {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (fighterCategory: CreateFighterCategoryDto) => {
      return fetch('http://localhost:3000/fighter-categories', {
        method: 'POST',
        body: JSON.stringify(fighterCategory),
        headers: {
          'content-type': 'application/json',
        },
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('fighter-categories')
      },
    }
  )
  return mutation
}

function useDeleteFighterCategory(fighterCategoryId: FighterCategory['id']) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async () => {
      return fetch(
        `http://localhost:3000/fighter-categories/${fighterCategoryId}`,
        {
          method: 'DELETE',
        }
      )
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('fighter-categories')
      },
    }
  )
  return mutation
}

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
        <tbody {...getTableBodyProps()}>
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

const Input = styled.input`
  border: ${(p) => (p['aria-invalid'] ? '2px solid red' : '')};
`

const Table = styled.table`
  border-collapse: collapse;
  border-spacing: unset;
  border-color: var(--blue-grey-500);
  border: 1px solid;

  & td + td,
  th + th {
    border-left: 1px solid;
  }
`

const Td = styled.td`
  padding: var(--s-3);
`
const Th = styled.th`
  padding: var(--s-3);
`

const Tr = styled.tr`
  &:nth-child(odd) {
    background-color: var(--blue-grey-900);
    color: var(--blue-grey-50);
    border-color: var(--blue-grey-50);
  }
`
