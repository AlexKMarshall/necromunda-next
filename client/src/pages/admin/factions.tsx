import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useTable } from 'react-table'
import styled from 'styled-components'
import { useId } from 'react-aria'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import {
  CreateFactionDto,
  createFactionDtoSchema,
  factionSchema,
} from 'schemas'
import { H1, H2, Stack } from 'components/lib'

function useQueryFactions() {
  const query = useQuery('factions', async () => {
    const response = await fetch('http://localhost:3000/factions')
    const data = await response.json()
    return factionSchema.array().parse(data)
  })

  const factions = query.data ?? []
  return { ...query, factions }
}

function useCreateFaction() {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (faction: CreateFactionDto) => {
      return fetch('http://localhost:3000/factions', {
        method: 'POST',
        body: JSON.stringify(faction),
        headers: {
          'content-type': 'application/json',
        },
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('factions')
      },
    }
  )
  return mutation
}

export default function Factions() {
  const query = useQueryFactions()
  const [showForm, setShowForm] = useState(false)
  const openForm = () => setShowForm(true)
  const closeForm = () => setShowForm(false)

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' as const },
      { Header: 'Id', accessor: 'id' as const },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: query.factions })

  const dialogTitleId = useId()

  return (
    <Stack>
      <H1>Factions</H1>
      <button onClick={openForm}>Add Faction</button>
      <Dialog
        isOpen={showForm}
        onDismiss={closeForm}
        aria-labelledby={dialogTitleId}
      >
        <Stack>
          <H2 id={dialogTitleId}>Add New Faction</H2>
          <AddFactionForm onSubmit={closeForm} />
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

interface AddFactionFormProps {
  onSubmit?: () => void
}

function AddFactionForm({ onSubmit }: AddFactionFormProps) {
  const mutation = useCreateFaction()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFactionDto>({
    resolver: zodResolver(createFactionDtoSchema),
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
      <button type="submit">Add faction</button>
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
